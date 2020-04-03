/*
 * @flow
 */

import {
  all,
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
} from 'immutable';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_LB_PROFILE,
  GET_LB_PROFILE_NEIGHBORS,
  getLBProfile,
  getLBProfileNeighbors,
} from './LongBeachProfileActions';

import Logger from '../../utils/Logger';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getESIDsFromApp } from '../../utils/AppUtils';
import { groupNeighborsByEntitySetIds } from '../../utils/DataUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import { isValidUuid } from '../../utils/Utils';
import {
  getLBPeoplePhotos,
  getLBPeopleStayAway,
} from '../people/LongBeachPeopleActions';
import {
  getLBPeoplePhotosWorker,
  getLBPeopleStayAwayWorker,
} from '../people/LongBeachPeopleSagas';

const {
  PEOPLE_FQN,
  SERVED_WITH_FQN,
  PROBATION_FQN,
  WARRANTS_FQN,
  SUBJECT_OF_FQN,
} = APP_TYPES_FQNS;

const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { getEntityData } = DataApiActions;
const { getEntityDataWorker } = DataApiSagas;
const LOG = new Logger('LongBeachProfileSagas');

function* getLBProfileNeighborsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response :Object = {
    data: {}
  };

  try {
    const { value: personEKID } = action;
    if (!isValidUuid(personEKID)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getLBProfileNeighbors.request(action.id));

    const app = yield select((state) => state.get('app', Map()));

    const [
      peopleESID,
      probationESID,
      servedWithESID,
      subjectOfESID,
      warrantsESID,
    ] = getESIDsFromApp(app, [
      PEOPLE_FQN,
      PROBATION_FQN,
      SERVED_WITH_FQN,
      SUBJECT_OF_FQN,
      WARRANTS_FQN,
    ]);

    const profileNeighborsSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: [personEKID],
        edgeEntitySetIds: [servedWithESID, subjectOfESID],
        destinationEntitySetIds: [probationESID, warrantsESID],
        sourceEntitySetIds: [],
      }
    };

    const profileNeighborsNeighbors = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(profileNeighborsSearchParams)
    );

    if (profileNeighborsNeighbors.error) throw profileNeighborsNeighbors.error;
    const neighbors = fromJS(profileNeighborsNeighbors.data)
      .get(personEKID, List());

    const neighborsByESID = groupNeighborsByEntitySetIds(neighbors);

    const probation = neighborsByESID.get(probationESID, List()).first();
    const warrant = neighborsByESID.get(warrantsESID, List()).first();
    response.data = {
      probation,
      warrant
    };

    yield put(getLBProfileNeighbors.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getLBProfileNeighbors.failure(action.id));
  }

  return response;
}

function* getLBProfileNeighborsWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_LB_PROFILE_NEIGHBORS, getLBProfileNeighborsWorker);
}

function* getLBProfileWorker(action :SequenceAction) :Generator<any, any, any> {
  const response :Object = {
    data: {}
  };

  try {
    const { value: personEKID } = action;
    if (!isValidUuid(personEKID)) throw ERR_ACTION_VALUE_TYPE;

    const peopleEKIDs = [personEKID];
    yield put(getLBProfile.request(action.id));

    const app = yield select((state) => state.get('app', Map()));

    const [peopleESID] = getESIDsFromApp(app, [PEOPLE_FQN]);

    const personRequest = call(
      getEntityDataWorker,
      getEntityData({
        entitySetId: peopleESID,
        entityKeyId: personEKID
      })
    );
    const profilePicturesRequest = call(
      getLBPeoplePhotosWorker,
      getLBPeoplePhotos(peopleEKIDs)
    );
    const stayAwayRequest = call(
      getLBPeopleStayAwayWorker,
      getLBPeopleStayAway(peopleEKIDs)
    );
    const profileNeighborsRequest = call(
      getLBProfileNeighborsWorker,
      getLBProfileNeighbors(personEKID)
    );

    const allResponses = yield all([
      profilePicturesRequest,
      stayAwayRequest,
      personRequest,
      profileNeighborsRequest
    ]);

    const neighborsError = allResponses.reduce((acc, neighborResponse) => {
      if (neighborResponse.error) {
        acc.push(neighborResponse.error);
      }
      return acc;
    }, []);

    if (neighborsError.length) throw neighborsError;

    const [profilePicturesResponse, stayAwayResponse, personResponse, neighborsResponse] = allResponses;

    const stayAwayData = fromJS(stayAwayResponse.data)
      .map((neighborsByEKID) => neighborsByEKID.valueSeq().first() || Map());
    const profilePicturesData = fromJS(profilePicturesResponse.data)
      .map((neighborsByEKID) => neighborsByEKID.valueSeq().first() || Map());

    const stayAway = stayAwayData.get('stayAway') || Map();
    const stayAwayLocation = stayAwayData.get('stayAwayLocations') || Map();
    const profilePicture = profilePicturesData.get('profilePictures') || Map();

    const person = fromJS(personResponse.data);
    const neighbors = fromJS(neighborsResponse.data);
    const warrant = neighbors.get('warrant') || Map();
    const probation = neighbors.get('probation') || Map();

    response.data = {
      person,
      probation,
      profilePicture,
      stayAway,
      stayAwayLocation,
      warrant,
    };

    yield put(getLBProfile.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getLBProfile.failure(action.id, error));
  }

  return response;
}

function* getLBProfileWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_LB_PROFILE, getLBProfileWorker);
}

export {
  getLBProfileNeighborsWatcher,
  getLBProfileNeighborsWorker,
  getLBProfileWatcher,
  getLBProfileWorker,
};
