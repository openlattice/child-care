// @flow
import isPlainObject from 'lodash/isPlainObject';
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
  fromJS
} from 'immutable';
import { Models, Types } from 'lattice';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import { DateTime } from 'luxon';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_PERSON_DATA,
  GET_PHYSICAL_APPEARANCE,
  GET_PROFILE_REPORTS,
  UPDATE_PROFILE_ABOUT,
  createPhysicalAppearance,
  getPersonData,
  getPhysicalAppearance,
  getProfileReports,
  updatePhysicalAppearance,
  updateProfileAbout,
} from './ProfileActions';
import { personFqnsByName, physicalAppearanceFqnsByName } from './constants';
import { countCrisisCalls, countPropertyOccurrance } from './premium/Utils';

import Logger from '../../utils/Logger';
import * as FQN from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getESIDFromApp } from '../../utils/AppUtils';
import { simulateResponseData } from '../../utils/DataUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import { isDefined } from '../../utils/LangUtils';
import { isValidUuid } from '../../utils/Utils';

const LOG = new Logger('ProfileSagas');

const { DataGraphBuilder } = Models;
const { UpdateTypes } = Types;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { createEntityAndAssociationData, getEntityData, updateEntityData } = DataApiActions;
const { createEntityAndAssociationDataWorker, getEntityDataWorker, updateEntityDataWorker } = DataApiSagas;

const {
  APPEARS_IN_FQN,
  BEHAVIORAL_HEALTH_REPORT_FQN,
  OBSERVED_IN_FQN,
  PEOPLE_FQN,
  PHYSICAL_APPEARANCE_FQN,
} = APP_TYPES_FQNS;

function* getPhysicalAppearanceWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getPhysicalAppearance.request(action.id, entityKeyId));

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

    const appearanceRequest = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(appearanceSearchParams)
    );

    if (appearanceRequest.error) throw appearanceRequest.error;
    const appearanceDataList = fromJS(appearanceRequest.data).get(entityKeyId, List());
    if (appearanceDataList.count() > 1) {
      LOG.warn('more than one appearance found in person', entityKeyId);
    }

    const appearanceData = appearanceDataList
      .getIn([0, 'neighborDetails'], Map());

    response.data = appearanceData;

    yield put(getPhysicalAppearance.success(action.id, appearanceData));
  }
  catch (error) {
    response.error = error;
    yield put(getPhysicalAppearance.failure(action.id, error));
  }

  return response;
}

function* getPhysicalAppearanceWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_PHYSICAL_APPEARANCE, getPhysicalAppearanceWorker);
}

function* getPersonDataWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getPersonData.request(action.id, entityKeyId));

    const app :Map = yield select((state) => state.get('app', Map()));
    const entitySetId :UUID = getESIDFromApp(app, PEOPLE_FQN);

    const personResponse = yield call(
      getEntityDataWorker,
      getEntityData({
        entitySetId,
        entityKeyId
      })
    );

    if (personResponse.error) throw personResponse.error;
    const personData = fromJS(personResponse.data);
    response.data = personData;
    yield put(getPersonData.success(action.id, personData));
  }
  catch (error) {
    response.error = error;
    yield put(getPersonData.failure(action.id, error));
  }
  return response;
}

function* getPersonDataWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_PERSON_DATA, getPersonDataWorker);
}

function* getProfileReportsWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getProfileReports.request(action.id, entityKeyId));

    const app :Map = yield select((state) => state.get('app', Map()));
    const reportESID :UUID = getESIDFromApp(app, BEHAVIORAL_HEALTH_REPORT_FQN);
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const appearsInESID :UUID = getESIDFromApp(app, APPEARS_IN_FQN);

    // all reports for person
    const reportsSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [appearsInESID],
        destinationEntitySetIds: [reportESID],
        sourceEntitySetIds: [],
      }
    };

    const reportsRequest = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(reportsSearchParams)
    );

    if (reportsRequest.error) throw reportsRequest.error;

    // Sort unique reports by datetime occurred DESC
    const reportsData = fromJS(reportsRequest.data)
      .get(entityKeyId, List())
      .map((report :Map) => report.get('neighborDetails'))
      .toSet()
      .toList()
      .sortBy((report :Map) :number => {
        const time = DateTime.fromISO(report.getIn([FQN.DATE_TIME_OCCURRED_FQN, 0]));

        return -time.valueOf();
      });

    const behaviorSummary = countPropertyOccurrance(reportsData, FQN.OBSERVED_BEHAVIORS_FQN);
    const crisisSummary = countCrisisCalls(reportsData, FQN.DATE_TIME_OCCURRED_FQN);

    yield put(getProfileReports.success(action.id, fromJS({
      data: reportsData,
      behaviorSummary,
      crisisSummary,
    })));
  }
  catch (error) {
    yield put(getProfileReports.failure(action.id));
  }
}

function* getProfileReportsWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_PROFILE_REPORTS, getProfileReportsWorker);
}

function* createPhysicalAppearanceWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value } :Object = action;
    const { appearanceProperties, personEKID } = value;

    if (!isDefined(appearanceProperties)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(personEKID) || !isPlainObject(appearanceProperties)) throw ERR_ACTION_VALUE_TYPE;
    yield put(createPhysicalAppearance.request(action.id, personEKID));

    const propertyTypesById :Map = yield select((state) => state.getIn(['edm', 'propertyTypesById']), Map());
    const app = yield select((state) => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const observedInESID :UUID = getESIDFromApp(app, OBSERVED_IN_FQN);
    const physicalAppearanceESID :UUID = getESIDFromApp(app, PHYSICAL_APPEARANCE_FQN);
    const datetimePTID :UUID = yield select((state) => state.getIn(['edm', 'fqnToIdMap', FQN.COMPLETED_DT_FQN]));

    const now = DateTime.local().toISO();
    const associations = {
      [observedInESID]: [{
        srcEntityIndex: 0,
        srcEntitySetId: physicalAppearanceESID,
        dstEntityKeyId: personEKID,
        dstEntitySetId: peopleESID,
        data: {
          [datetimePTID]: [now]
        }
      }]
    };

    const entities = {
      [physicalAppearanceESID]: [appearanceProperties]
    };

    const dataGraph = new DataGraphBuilder()
      .setAssociations(associations)
      .setEntities(entities)
      .build();

    const createResponse = yield call(
      createEntityAndAssociationDataWorker,
      createEntityAndAssociationData(dataGraph)
    );

    if (createResponse.error) throw createResponse.error;

    const createdAppearanceEKID = fromJS(createResponse.data).getIn([
      'entityKeyIds',
      physicalAppearanceESID,
      0
    ]);

    const newPhysicalAppearance = simulateResponseData(
      fromJS(appearanceProperties),
      createdAppearanceEKID,
      propertyTypesById
    );
    response.data = newPhysicalAppearance;

    yield put(createPhysicalAppearance.success(action.id, newPhysicalAppearance));
  }
  catch (error) {
    response.error = error;
    yield put(createPhysicalAppearance.failure(action.id, error));
  }

  return response;
}

function* updatePhysicalAppearanceWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value } :Object = action;
    const { appearanceEKID, appearanceProperties } = value;
    if (!isDefined(appearanceProperties)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(appearanceEKID) || !isPlainObject(appearanceProperties)) throw ERR_ACTION_VALUE_TYPE;
    yield put(updatePhysicalAppearance.request(action.id));

    const propertyTypesById :Map = yield select((state) => state.getIn(['edm', 'propertyTypesById']), Map());
    const app = yield select((state) => state.get('app', Map()));
    const physicalAppearanceESID :UUID = getESIDFromApp(app, PHYSICAL_APPEARANCE_FQN);

    const updateResponse = yield call(
      updateEntityDataWorker,
      updateEntityData({
        entitySetId: physicalAppearanceESID,
        entities: {
          [appearanceEKID]: appearanceProperties
        },
        updateType: UpdateTypes.PartialReplace,
      })
    );

    if (updateResponse.error) throw updateResponse.error;

    const updatedPhysicalAppearance = simulateResponseData(
      fromJS(appearanceProperties),
      appearanceEKID,
      propertyTypesById
    );
    response.data = updatedPhysicalAppearance;

    yield put(updatePhysicalAppearance.success(action.id, updatedPhysicalAppearance));
  }
  catch (error) {
    response.error = error;
    yield put(updatePhysicalAppearance.failure(action.id, error));
  }

  return response;
}

const getUpdatedPropertiesByName = (data, fqnsByName :any, fqnToIdMap) :Object => {
  const updatedProperties = {};
  Object.keys(fqnsByName).forEach((name) => {
    const fqn = fqnsByName[name];
    const propertyTypeId = fqnToIdMap.get(fqn);
    let formattedValue = [];
    const currentValue = data.get(name);
    if (Array.isArray(currentValue)) {
      formattedValue = currentValue;
    }
    else if (currentValue !== '' && currentValue !== undefined && currentValue !== null) {
      formattedValue = [currentValue];
    }
    updatedProperties[propertyTypeId] = formattedValue;
  });

  return updatedProperties;
};

function* updateProfileAboutWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } :Object = action;
    const { data, personEKID, appearanceEKID } = value;

    if (!isDefined(data)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(personEKID)) throw ERR_ACTION_VALUE_TYPE;
    yield put(updateProfileAbout.request(action.id, personEKID));

    const propertyTypesById :Map = yield select((state) => state.getIn(['edm', 'propertyTypesById']), Map());
    const fqnToIdMap :Map = yield select((state) => state.getIn(['edm', 'fqnToIdMap']), Map());
    const app = yield select((state) => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);

    const newPersonProperties = getUpdatedPropertiesByName(
      data,
      personFqnsByName,
      fqnToIdMap
    );

    const appearanceProperties = getUpdatedPropertiesByName(
      data,
      physicalAppearanceFqnsByName,
      fqnToIdMap
    );

    const updatePersonRequest = call(
      updateEntityDataWorker,
      updateEntityData({
        entitySetId: peopleESID,
        entities: {
          [personEKID]: newPersonProperties
        },
        updateType: UpdateTypes.PartialReplace,
      })
    );

    let physicalAppearanceRequest = call(
      createPhysicalAppearanceWorker,
      createPhysicalAppearance({ appearanceProperties, personEKID })
    );

    // update appearance if it already exists
    if (appearanceEKID) {
      physicalAppearanceRequest = call(
        updatePhysicalAppearanceWorker,
        updatePhysicalAppearance({ appearanceEKID, appearanceProperties })
      );
    }

    const [personResponse, appearanceResponse] = yield all([
      updatePersonRequest,
      physicalAppearanceRequest,
    ]);

    if (personResponse.error) throw personResponse.error;
    if (appearanceResponse.error) throw appearanceResponse.error;

    const updatedPerson = simulateResponseData(fromJS(newPersonProperties), personEKID, propertyTypesById);
    const updatedPhysicalAppearance = appearanceResponse.data;

    yield put(updateProfileAbout.success(action.id, { updatedPerson, updatedPhysicalAppearance }));
  }
  catch (error) {
    yield put(updateProfileAbout.failure(action.id, error));
  }
}

function* updateProfileAboutWatcher() :Generator<any, any, any> {
  yield takeEvery(UPDATE_PROFILE_ABOUT, updateProfileAboutWorker);
}

export {
  getPersonDataWatcher,
  getPersonDataWorker,
  getPhysicalAppearanceWatcher,
  getPhysicalAppearanceWorker,
  getProfileReportsWatcher,
  getProfileReportsWorker,
  updateProfileAboutWatcher,
  updateProfileAboutWorker,
};
