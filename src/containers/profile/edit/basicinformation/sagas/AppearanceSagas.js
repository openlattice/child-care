// @flow
import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import { List, Map, fromJS } from 'immutable';
import type { SequenceAction } from 'redux-reqseq';
import { Constants } from 'lattice';
import {
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';

import Logger from '../../../../../utils/Logger';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../../../utils/Errors';
import { isDefined } from '../../../../../utils/LangUtils';
import { isValidUuid } from '../../../../../utils/Utils';
import {
  GET_APPEARANCE,
  SUBMIT_APPEARANCE,
  UPDATE_APPEARANCE,
  getAppearance,
  submitAppearance,
  updateAppearance,
} from '../actions/BasicInformationActions';
import {
  submitDataGraph,
  submitPartialReplace,
} from '../../../../../core/sagas/data/DataActions';
import {
  submitDataGraphWorker,
  submitPartialReplaceWorker,
} from '../../../../../core/sagas/data/DataSagas';

import { getESIDFromApp } from '../../../../../utils/AppUtils';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import { groupNeighborsByEntitySetIds } from '../../../../../utils/DataUtils';
import { constructEntityIndexToIdMap, constructFormData } from './utils/AppearanceUtils';

const LOG = new Logger('BasicInformationSagas');
const { OPENLATTICE_ID_FQN } = Constants;
const {
  OBSERVED_IN_FQN,
  PEOPLE_FQN,
  PHYSICAL_APPEARANCE_FQN,
} = APP_TYPES_FQNS;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

function* getAppearanceWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getAppearance.request(action.id, entityKeyId));

    const app :Map = yield select((state) => state.get('app', Map()));
    const entitySetId :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const physicalAppearanceESID :UUID = getESIDFromApp(app, PHYSICAL_APPEARANCE_FQN);
    const observedInESID :UUID = getESIDFromApp(app, OBSERVED_IN_FQN);

    const appearanceSearchParams = {
      entitySetId,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [observedInESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [physicalAppearanceESID],
      }
    };

    const appearanceResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(appearanceSearchParams)
    );

    if (appearanceResponse.error) throw appearanceResponse.error;

    const neighbors = fromJS(appearanceResponse.data)
      .get(entityKeyId, List());

    const neighborsByESID = groupNeighborsByEntitySetIds(neighbors);

    const appearanceDataList = neighborsByESID.get(physicalAppearanceESID, List());
    if (appearanceDataList.count() > 1) {
      LOG.warn('more than one appearance found in person', entityKeyId);
    }
    const appearanceData = appearanceDataList.first() || Map();

    const appearanceEKID = appearanceData.getIn([OPENLATTICE_ID_FQN, 0]);

    response.entityIndexToIdMap = constructEntityIndexToIdMap(appearanceEKID);

    response.formData = constructFormData(appearanceData);

    response.data = fromJS(appearanceData);

    yield put(getAppearance.success(action.id, response));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getAppearance.failure(action.id, error));
  }

  return response;
}

function* getAppearanceWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_APPEARANCE, getAppearanceWorker);
}

function* submitAppearanceWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(submitAppearance.request(action.id));
    const response = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    const newEntityKeyIdsByEntitySetId = fromJS(response.data).get('entityKeyIds');

    const selectedOrgEntitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const entitySetNamesByEntitySetId = selectedOrgEntitySetIds.flip();

    const newEntityKeyIdsByEntitySetName = newEntityKeyIdsByEntitySetId
      .mapKeys((entitySetId) => entitySetNamesByEntitySetId.get(entitySetId));

    const appearanceEKID = newEntityKeyIdsByEntitySetName.getIn([PHYSICAL_APPEARANCE_FQN, 0]);

    const entityIndexToIdMap = constructEntityIndexToIdMap(appearanceEKID);

    const { path, properties } = value;

    yield put(submitAppearance.success(action.id, {
      entityIndexToIdMap,
      path,
      properties
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(submitAppearance.failure(action.id, error));
  }
}

function* submitAppearanceWatcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_APPEARANCE, submitAppearanceWorker);
}

function* updateAppearanceWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(updateAppearance.request(action.id, value));
    const response = yield call(submitPartialReplaceWorker, submitPartialReplace(value));

    if (response.error) throw response.error;

    yield put(updateAppearance.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(updateAppearance.failure(action.id, error));
  }
}

function* updateAppearanceWatcher() :Generator<any, any, any> {
  yield takeEvery(UPDATE_APPEARANCE, updateAppearanceWorker);
}

export {
  getAppearanceWorker,
  getAppearanceWatcher,
  submitAppearanceWorker,
  submitAppearanceWatcher,
  updateAppearanceWorker,
  updateAppearanceWatcher,
};
