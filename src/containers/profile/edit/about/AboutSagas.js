// @flow
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
  getIn,
  has,
} from 'immutable';
import { Constants } from 'lattice';
import {
  SearchApiActions,
  SearchApiSagas
} from 'lattice-sagas';
import { DateTime } from 'luxon';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_ABOUT_PLAN,
  GET_RESPONSIBLE_USER,
  SUBMIT_ABOUT_PLAN,
  UPDATE_ABOUT_PLAN,
  getAboutPlan,
  getResponsibleUser,
  submitAboutPlan,
  updateAboutPlan,
} from './AboutActions';
import { constructEntityIndexToIdMap, constructFormData } from './AboutUtils';

import Logger from '../../../../utils/Logger';
import {
  createOrReplaceAssociation,
  submitDataGraph,
  submitPartialReplace,
} from '../../../../core/sagas/data/DataActions';
import {
  createOrReplaceAssociationWorker,
  submitDataGraphWorker,
  submitPartialReplaceWorker,
} from '../../../../core/sagas/data/DataSagas';
import { DATE_TIME_FQN } from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { getESIDFromApp } from '../../../../utils/AppUtils';
import { formatDataGraphResponse } from '../../../../utils/DataUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../../utils/Errors';
import { isDefined } from '../../../../utils/LangUtils';
import { isValidUuid } from '../../../../utils/Utils';
import { getResponsePlan } from '../responseplan/ResponsePlanActions';
import { getResponsePlanWorker } from '../responseplan/ResponsePlanSagas';

const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { OPENLATTICE_ID_FQN } = Constants;

const {
  ASSIGNED_TO_FQN,
  PEOPLE_FQN,
  STAFF_FQN,
  RESPONSE_PLAN_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('AboutSagas');

function* getResponsibleUserWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getResponsibleUser.request(action.id));
    const app :Map = yield select((state) => state.get('app', Map()));
    const peopleESID = getESIDFromApp(app, PEOPLE_FQN);
    const staffESID = getESIDFromApp(app, STAFF_FQN);
    const assignedToESID = getESIDFromApp(app, ASSIGNED_TO_FQN);

    const staffSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [assignedToESID],
        destinationEntitySetIds: [staffESID],
        sourceEntitySetIds: []
      }
    };

    const staffResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(staffSearchParams)
    );

    if (staffResponse.error) throw staffResponse.error;
    const responsibleUsers = fromJS(staffResponse.data).get(entityKeyId, List());
    if (responsibleUsers.count() > 1) {
      LOG.warn('more than one reponsible user found for person', entityKeyId);
    }

    const responsibleUser = responsibleUsers.first() || Map();

    response.data = responsibleUser;

    yield put(getResponsibleUser.success(action.id, responsibleUser));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(getResponsibleUser.failure(action.id, error));
  }

  return response;
}

function* getResponsibleUserWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_RESPONSIBLE_USER, getResponsibleUserWorker);
}

function* getAboutPlanWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getAboutPlan.request(action.id, entityKeyId));

    const responsePlanRequest = call(
      getResponsePlanWorker,
      getResponsePlan(entityKeyId)
    );

    const responsibleUserRequest = call(
      getResponsibleUserWorker,
      getResponsibleUser(entityKeyId)
    );

    const [responsePlan, responsibleUser] = yield all([
      responsePlanRequest,
      responsibleUserRequest
    ]);

    if (responsePlan.error) throw responsePlan.error;
    if (responsibleUser.error) throw responsibleUser.error;

    const responsibleUserData = fromJS(responsibleUser).getIn(['data', 'neighborDetails']) || Map();
    const responsePlanEKID = getIn(responsePlan, ['data', OPENLATTICE_ID_FQN, 0]);
    const assignedToEKID = getIn(responsibleUser, ['data', 'associationDetails', OPENLATTICE_ID_FQN, 0]);
    const formData = constructFormData(fromJS(responsePlan.data), responsibleUserData);
    const entityIndexToIdMap = constructEntityIndexToIdMap(responsePlanEKID, assignedToEKID);

    yield put(getAboutPlan.success(action.id, {
      data: responsibleUserData,
      entityIndexToIdMap,
      formData,
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getAboutPlan.failure(action.id));
  }
}

function* getAboutPlanWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_ABOUT_PLAN, getAboutPlanWorker);
}

function* updateAboutPlanWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    yield put(updateAboutPlan.request(action.id, value));

    const app :Map = yield select((state) => state.get('app', Map()));
    const reservedId = yield select((state) => state.getIn(['edm', 'fqnToIdMap', OPENLATTICE_ID_FQN]));
    const staffESID = getESIDFromApp(app, STAFF_FQN);
    const assignedToESID = getESIDFromApp(app, ASSIGNED_TO_FQN);
    const peopleESID = getESIDFromApp(app, PEOPLE_FQN);
    const datetimePTID :UUID = yield select((state) => state.getIn(['edm', 'fqnToIdMap', DATE_TIME_FQN]));

    let entityIndexToIdMap = Map();
    const { entityData } = value;
    if (has(entityData, staffESID)) {
      const newStaffEKID = getIn(entityData, [staffESID, 0, reservedId, 0]);
      const entityKeyId = yield select((state) => state.getIn(
        ['profile', 'about', 'entityIndexToIdMap', ASSIGNED_TO_FQN, 0]
      ));
      const personEKID = yield select((state) => state.getIn(
        ['profile', 'basicInformation', 'basics', 'data', OPENLATTICE_ID_FQN, 0]
      ));

      const association = {
        [assignedToESID]: [{
          data: {
            [datetimePTID]: [DateTime.local().toISO()]
          },
          dst: {
            entitySetId: staffESID,
            entityKeyId: newStaffEKID
          },
          src: {
            entitySetId: peopleESID,
            entityKeyId: personEKID
          }
        }]
      };

      const associationResponse = yield call(
        createOrReplaceAssociationWorker,
        createOrReplaceAssociation({
          association,
          entityKeyId,
          entitySetId: assignedToESID,
        })
      );

      if (associationResponse.error) throw associationResponse.error;
      const newAssignedToEKID :UUID = getIn(associationResponse, ['data', assignedToESID, 0]);
      entityIndexToIdMap = entityIndexToIdMap.setIn([ASSIGNED_TO_FQN, 0], newAssignedToEKID);

      delete entityData[staffESID];
    }

    const response = yield call(submitPartialReplaceWorker, submitPartialReplace(value));

    if (response.error) throw response.error;

    yield put(updateAboutPlan.success(action.id, { entityIndexToIdMap }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(updateAboutPlan.failure(action.id, error));
  }
}

function* updateAboutPlanWatcher() :Generator<any, any, any> {
  yield takeEvery(UPDATE_ABOUT_PLAN, updateAboutPlanWorker);
}

function* submitAboutPlanWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(submitAboutPlan.request(action.id));
    const response = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    const responseData = fromJS(response.data);
    const app = yield select((state) => state.get('app'), Map());

    const { entities, associations } = formatDataGraphResponse(responseData, app);

    const responsePlanEKID = entities.get(RESPONSE_PLAN_FQN).first();
    const assignedToEKID = associations.get(ASSIGNED_TO_FQN).first();

    const entityIndexToIdMap = constructEntityIndexToIdMap(responsePlanEKID, assignedToEKID);

    const { path, properties } = value;
    yield put(submitAboutPlan.success(action.id, {
      entityIndexToIdMap,
      path,
      properties
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(submitAboutPlan.failure(action.id));
  }
}

function* submitAboutPlanWatcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_ABOUT_PLAN, submitAboutPlanWorker);
}

export {
  getAboutPlanWatcher,
  getAboutPlanWorker,
  getResponsibleUserWatcher,
  getResponsibleUserWorker,
  submitAboutPlanWatcher,
  submitAboutPlanWorker,
  updateAboutPlanWatcher,
  updateAboutPlanWorker,
};
