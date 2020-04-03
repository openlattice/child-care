/*
 * @flow
 */

import isPlainObject from 'lodash/isPlainObject';
import {
  call,
  put,
  select,
  takeEvery,
  takeLatest
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS
} from 'immutable';
import { Constants } from 'lattice';
import {
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import { DateTime } from 'luxon';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_PEOPLE_PHOTOS,
  GET_RECENT_INCIDENTS,
  SEARCH_PEOPLE,
  getPeoplePhotos,
  getRecentIncidents,
  searchPeople,
} from './PeopleActions';

import Logger from '../../utils/Logger';
import * as FQN from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import {
  getESIDFromApp,
  getPeopleESId,
} from '../../utils/AppUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';

const {
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  IMAGE_FQN,
  IS_PICTURE_OF_FQN,
  PEOPLE_FQN,
} = APP_TYPES_FQNS;

const { OPENLATTICE_ID_FQN } = Constants;
const { executeSearch, searchEntityNeighborsWithFilter } = SearchApiActions;
const { executeSearchWorker, searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const LOG = new Logger('PeopleSagas');

export function* getPeoplePhotosWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value: entityKeyIds } = action;
    if (!List.isList(entityKeyIds)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getPeoplePhotos.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const imageESID :UUID = getESIDFromApp(app, IMAGE_FQN);
    const isPictureOfESID :UUID = getESIDFromApp(app, IS_PICTURE_OF_FQN);

    const imageSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: entityKeyIds.toJS(),
        edgeEntitySetIds: [isPictureOfESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [imageESID]
      }
    };

    const imageResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(imageSearchParams)
    );

    const profilePicByEKID = fromJS(imageResponse.data)
      .map((entity) => entity.first().get('neighborDetails'));

    yield put(getPeoplePhotos.success(action.id, profilePicByEKID));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getPeoplePhotos.failure(action.id));
  }
}

export function* getPeoplePhotosWatcher() :Generator<*, *, *> {
  yield takeEvery(GET_PEOPLE_PHOTOS, getPeoplePhotosWorker);
}

export function* getRecentIncidentsWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: entityKeyIds } = action;
    if (!List.isList(entityKeyIds)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getRecentIncidents.request(action.id, entityKeyIds));

    const app :Map = yield select((state) => state.get('app', Map()));
    const reportESID :UUID = getESIDFromApp(app, BEHAVIORAL_HEALTH_REPORT_FQN);
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const appearsInESID :UUID = getESIDFromApp(app, APPEARS_IN_FQN);

    // all reports for each person
    const reportsSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: entityKeyIds.toJS(),
        edgeEntitySetIds: [appearsInESID],
        destinationEntitySetIds: [reportESID],
        sourceEntitySetIds: [],
      }
    };

    const incidentsResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(reportsSearchParams)
    );

    if (incidentsResponse.error) throw incidentsResponse.error;

    // get most recent incident per EKID
    const recentIncidentsByEKID = fromJS(incidentsResponse.data)
      .map((reports) => {
        const recentIncident = reports
          .map((report :Map) => report.get('neighborDetails'))
          .toSet()
          .toList()
          .sortBy((report :Map) :number => {
            const time = DateTime.fromISO(report.getIn([FQN.DATE_TIME_OCCURRED_FQN, 0]));

            return -time.valueOf();
          })
          .first();

        const recentIncidentDT = DateTime.fromISO(recentIncident.getIn([FQN.DATE_TIME_OCCURRED_FQN, 0]));
        const totalIncidents = reports.count();

        return Map({
          recentIncidentDT,
          totalIncidents,
        });
      });

    yield put(getRecentIncidents.success(action.id, recentIncidentsByEKID));
  }
  catch (error) {
    yield put(getRecentIncidents.failure(action.id));
  }
}

export function* getRecentIncidentsWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_RECENT_INCIDENTS, getRecentIncidentsWorker);
}

function* searchPeopleWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchInputs, start = 0, maxHits = 20 } = value;
    yield put(searchPeople.request(action.id, { searchInputs }));

    const edm :Map<*, *> = yield select((state) => state.get('edm'));
    const app = yield select((state) => state.get('app', Map()));

    const peopleESID = getPeopleESId(app);
    const dobPTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_DOB_FQN]);
    const ethnicityPTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_ETHNICITY_FQN]);
    const firstNamePTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_FIRST_NAME_FQN]);
    const lastNamePTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_LAST_NAME_FQN]);
    const numSourcesPTID :UUID = edm.getIn(['fqnToIdMap', FQN.NUM_SOURCES_FOUND_IN_FQN]);
    const racePTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_RACE_FQN]);
    const sexPTID :UUID = edm.getIn(['fqnToIdMap', FQN.PERSON_SEX_FQN]);

    const searchFields = [];
    const updateSearchField = (searchTerm :string, property :string, metaphone :boolean = false) => {
      searchFields.push({
        searchTerm: metaphone ? searchTerm : `${searchTerm}*`,
        property,
        exact: true
      });
    };

    const firstName :string = searchInputs.get('firstName', '').trim();
    const lastName :string = searchInputs.get('lastName', '').trim();
    const dob :string = searchInputs.get('dob');
    const race :Object = searchInputs.get('race');
    const sex :Object = searchInputs.get('sex');
    const ethnicity :Object = searchInputs.get('ethnicity');
    const metaphone :boolean = searchInputs.get('metaphone');

    if (firstName.length) {
      updateSearchField(firstName, firstNamePTID, metaphone);
    }
    if (lastName.length) {
      updateSearchField(lastName, lastNamePTID, metaphone);
    }
    const dobDT = DateTime.fromISO(dob);
    if (dobDT.isValid) {
      updateSearchField(dobDT.toISODate(), dobPTID);
    }
    if (isPlainObject(race)) {
      updateSearchField(race.value, racePTID, true);
    }
    if (isPlainObject(sex)) {
      updateSearchField(sex.value, sexPTID, true);
    }
    if (isPlainObject(ethnicity)) {
      updateSearchField(ethnicity.value, ethnicityPTID, true);
    }

    const searchOptions = {
      entitySetIds: [peopleESID],
      maxHits,
      start,
      constraints: [{
        constraints: [{
          type: 'advanced',
          searchFields,
        }]
      }],
      sort: {
        propertyTypeId: numSourcesPTID,
        type: 'field'
      }
    };

    const { data, error } = yield call(
      executeSearchWorker,
      executeSearch({ searchOptions })
    );

    if (error) throw error;

    const hits = fromJS(data.hits);

    const peopleEKIDs = hits.map((person) => person.getIn([OPENLATTICE_ID_FQN, 0]));

    yield put(searchPeople.success(action.id, { hits, totalHits: data.numHits }));
    if (!peopleEKIDs.isEmpty()) {
      yield put(getPeoplePhotos(peopleEKIDs));
      yield put(getRecentIncidents(peopleEKIDs));
    }
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(searchPeople.failure(action.id, error));
  }
}

export function* searchPeopleWatcher() :Generator<*, *, *> {
  yield takeEvery(SEARCH_PEOPLE, searchPeopleWorker);
}
