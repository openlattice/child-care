// @flow
import {
  all,
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import {
  Map,
  fromJS,
  get,
  getIn,
  has,
} from 'immutable';
import { Constants, Types } from 'lattice';
import {
  DataApiActions,
  DataApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  SELECT_ISSUE,
  SET_ISSUE_STATUS,
  SUBMIT_ISSUE,
  UPDATE_ISSUE,
  selectIssue,
  setIssueStatus,
  submitIssue,
  updateIssue,
} from './IssueActions';
import { constructEntityIndexToIdMap } from './IssueUtils';

import Logger from '../../../utils/Logger';
import {
  createOrReplaceAssociation,
  submitDataGraph,
  submitPartialReplace,
} from '../../../core/sagas/data/DataActions';
import {
  createOrReplaceAssociationWorker,
  submitDataGraphWorker,
  submitPartialReplaceWorker,
} from '../../../core/sagas/data/DataSagas';
import { DATE_TIME_FQN, ENTRY_UPDATED_FQN, STATUS_FQN } from '../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { getESIDFromApp } from '../../../utils/AppUtils';
import { groupNeighborsByEntitySetIds, simulateResponseData } from '../../../utils/DataUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../utils/Errors';
import { isDefined, isEmptyString } from '../../../utils/LangUtils';
import { isValidUuid } from '../../../utils/Utils';

const LOG = new Logger('IssueSagas');

const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;
const { OPENLATTICE_ID_FQN } = Constants;

const { UpdateTypes } = Types;
const {
  updateEntityData,
  getEntityData
} = DataApiActions;
const {
  getEntityDataWorker,
  updateEntityDataWorker,
} = DataApiSagas;

const {
  ASSIGNED_TO_FQN,
  ISSUE_FQN,
  PEOPLE_FQN,
  REPORTED_FQN,
  STAFF_FQN,
  SUBJECT_OF_FQN,
} = APP_TYPES_FQNS;

function* submitIssueWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    yield put(submitIssue.request(action.id));

    const response = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    yield put(submitIssue.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(submitIssue.failure(action.id));
  }
}

function* submitIssueWatcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_ISSUE, submitIssueWorker);
}

function* updateIssueWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    yield put(updateIssue.request(action.id, value));

    const app :Map = yield select((state) => state.get('app', Map()));
    const propertyTypesById :Map = yield select((state) => state.getIn(['edm', 'propertyTypesById']), Map());
    const reservedId = yield select((state) => state.getIn(['edm', 'fqnToIdMap', OPENLATTICE_ID_FQN]));
    const staffESID = getESIDFromApp(app, STAFF_FQN);
    const assignedToESID = getESIDFromApp(app, ASSIGNED_TO_FQN);
    const issueESID = getESIDFromApp(app, ISSUE_FQN);
    const datetimePTID :UUID = yield select((state) => state.getIn(['edm', 'fqnToIdMap', DATE_TIME_FQN]));
    const entryUpdatedPTID :UUID = yield select((state) => state.getIn(['edm', 'fqnToIdMap', ENTRY_UPDATED_FQN]));

    const { entityData, entityIndexToIdMap, responsibleUsers } = value;

    const assignedToEKID = entityIndexToIdMap.getIn([ASSIGNED_TO_FQN, 0]);
    const issueEKID = entityIndexToIdMap.getIn([ISSUE_FQN, 0]);
    const staffEKID = entityIndexToIdMap.getIn([STAFF_FQN, 0]) || 0;

    let newEntityIndexToIdMap = Map();
    let assignee;
    if (has(entityData, staffESID)) {
      const newStaffEKID = getIn(entityData, [staffESID, staffEKID, reservedId, 0]);
      const nowAsIsoString = getIn(entityData, [issueESID, issueEKID, entryUpdatedPTID, 0]);

      const association = {
        [assignedToESID]: [{
          data: {
            [datetimePTID]: [nowAsIsoString]
          },
          dst: {
            entitySetId: staffESID,
            entityKeyId: newStaffEKID
          },
          src: {
            entitySetId: issueESID,
            entityKeyId: issueEKID,
          }
        }]
      };

      const associationResponse = yield call(
        createOrReplaceAssociationWorker,
        createOrReplaceAssociation({
          association,
          entityKeyId: assignedToEKID,
          entitySetId: assignedToESID,
        })
      );

      if (associationResponse.error) throw associationResponse.error;
      const newAssignedToEKID :UUID = getIn(associationResponse, ['data', assignedToESID, 0]);
      newEntityIndexToIdMap = entityIndexToIdMap
        .setIn([ASSIGNED_TO_FQN.toString(), 0], newAssignedToEKID)
        .setIn([STAFF_FQN.toString(), 0], newStaffEKID);

      assignee = responsibleUsers.find((user) => user.getIn([OPENLATTICE_ID_FQN, 0]) === newStaffEKID);
      delete entityData[staffESID];
    }

    const updatedProperties = fromJS(entityData).getIn([issueESID, issueEKID], Map());
    const simulatedData = simulateResponseData(updatedProperties, issueEKID, propertyTypesById);

    const response = yield call(submitPartialReplaceWorker, submitPartialReplace(value));
    if (response.error) throw response.error;

    yield put(updateIssue.success(action.id, {
      entityIndexToIdMap: newEntityIndexToIdMap,
      issue: simulatedData,
      assignee
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(updateIssue.failure(action.id));
  }
}

function* updateIssueWatcher() :Generator<any, any, any> {
  yield takeEvery(UPDATE_ISSUE, updateIssueWorker);
}

function* selectIssueWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    yield put(selectIssue.request(action.id));

    const issueEKID :string = get(value, 'id');

    const app :Map = yield select((state) => state.get('app'), Map());
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const staffESID :UUID = getESIDFromApp(app, STAFF_FQN);
    const reportedESID :UUID = getESIDFromApp(app, REPORTED_FQN);
    const assignedToESID :UUID = getESIDFromApp(app, ASSIGNED_TO_FQN);
    const subjectOfESID :UUID = getESIDFromApp(app, SUBJECT_OF_FQN);
    const issueESID :UUID = getESIDFromApp(app, ISSUE_FQN);

    const issueRequest = call(
      getEntityDataWorker,
      getEntityData({
        entitySetId: issueESID,
        entityKeyId: issueEKID
      })
    );

    const neighborSearchParams = {
      entitySetId: issueESID,
      filter: {
        entityKeyIds: [issueEKID],
        edgeEntitySetIds: [reportedESID, assignedToESID, subjectOfESID],
        destinationEntitySetIds: [staffESID],
        sourceEntitySetIds: [peopleESID, staffESID],
      }
    };

    const neighborsRequest = call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(neighborSearchParams)
    );

    const [issueResponse, neighborResponse] = yield all([
      issueRequest,
      neighborsRequest,
    ]);

    if (issueResponse.error) throw neighborResponse.error;
    if (neighborResponse.error) throw neighborResponse.error;

    const neighborResponseData = fromJS(neighborResponse.data).get(issueEKID);
    const neighborsByEdge = groupNeighborsByEntitySetIds(neighborResponseData, true, true);

    const assignee = neighborsByEdge.getIn([assignedToESID, 0, 'neighborDetails'], Map());
    const reporter = neighborsByEdge.getIn([reportedESID, 0, 'neighborDetails'], Map());
    const subject = neighborsByEdge.getIn([subjectOfESID, 0, 'neighborDetails'], Map());
    const issue = fromJS(issueResponse.data);

    const assignedToEKID = neighborsByEdge
      .getIn([assignedToESID, 0, 'associationDetails', OPENLATTICE_ID_FQN, 0]);
    const assigneeEKID = assignee.getIn([OPENLATTICE_ID_FQN, 0]);
    const entityIndexToIdMap = constructEntityIndexToIdMap(assignedToEKID, assigneeEKID, issueEKID);

    const data = fromJS({
      assignee,
      issue,
      reporter,
      subject,
    });

    yield put(selectIssue.success(action.id, {
      data,
      entityIndexToIdMap
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(selectIssue.failure(action.id));
  }
}

function* selectIssueWatcher() :Generator<any, any, any> {
  yield takeEvery(SELECT_ISSUE, selectIssueWorker);
}

function* setIssueStatusWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    const { entityKeyId, status } = value;

    if (!isValidUuid(entityKeyId) || isEmptyString(status)) {
      throw ERR_ACTION_VALUE_TYPE;
    }

    yield put(setIssueStatus.request(action.id));

    const app :Map = yield select((state) => state.get('app'), Map());
    const propertyTypesById = yield select((state) => state.getIn(['edm', 'propertyTypesById']), Map());
    const issueESID :UUID = getESIDFromApp(app, ISSUE_FQN);
    const statusPTID :UUID = yield select((state) => state.getIn(['edm', 'fqnToIdMap', STATUS_FQN]));

    const entities = {
      [entityKeyId]: {
        [statusPTID]: [status]
      }
    };

    const statusResponse = yield call(
      updateEntityDataWorker,
      updateEntityData({
        entitySetId: issueESID,
        entities,
        updateType: UpdateTypes.PartialReplace
      })
    );

    if (statusResponse.error) throw statusResponse.error;
    const updatedProperties = fromJS(entities).get(entityKeyId, Map());
    const simulatedData = simulateResponseData(updatedProperties, entityKeyId, propertyTypesById);

    yield put(setIssueStatus.success(action.id, {
      issue: simulatedData
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(setIssueStatus.failure(action.id, error));
  }
}

function* setIssueStatusWatcher() :Generator<any, any, any> {
  yield takeEvery(SET_ISSUE_STATUS, setIssueStatusWorker);
}

export {
  selectIssueWatcher,
  selectIssueWorker,
  setIssueStatusWatcher,
  setIssueStatusWorker,
  submitIssueWatcher,
  submitIssueWorker,
  updateIssueWatcher,
  updateIssueWorker,
};
