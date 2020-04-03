// @flow
import {
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import { List, Map, fromJS } from 'immutable';
import {
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import { DateTime } from 'luxon';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_ALL_ISSUES,
  GET_MY_OPEN_ISSUES,
  GET_REPORTED_BY_ME,
  getAllIssues,
  getMyOpenIssues,
  getReportedByMe,
} from './IssuesActions';
import { STATUS } from './issue/constants';

import Logger from '../../utils/Logger';
import { COMPLETED_DT_FQN, OPENLATTICE_ID_FQN, STATUS_FQN } from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getESIDFromApp } from '../../utils/AppUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import { isValidUuid } from '../../utils/Utils';

const {
  executeSearch,
  searchEntityNeighborsWithFilter,
} = SearchApiActions;
const {
  executeSearchWorker,
  searchEntityNeighborsWithFilterWorker,
} = SearchApiSagas;

const {
  ASSIGNED_TO_FQN,
  ISSUE_FQN,
  REPORTED_FQN,
  STAFF_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('IssueSagas');

const formatIssueRowData = (entityData :List<Map>) :List<Map> => entityData
  .map((neighbor) => {
    const id = neighbor.getIn([OPENLATTICE_ID_FQN, 0]);
    return neighbor
      .map((details) => details.get(0))
      .set('id', id);
  })
  .sortBy((issue :Map) :number => {
    const time = DateTime.fromISO(issue.get(COMPLETED_DT_FQN));

    return -time.valueOf();
  });

function* getMyOpenIssuesWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: currentUserEKID } = action;
    if (!isValidUuid(currentUserEKID)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getMyOpenIssues.request(action.id));

    const app = yield select((state) => state.get('app', Map()));
    const issueESID = getESIDFromApp(app, ISSUE_FQN);
    const staffESID = getESIDFromApp(app, STAFF_FQN);
    const assignedToESID = getESIDFromApp(app, ASSIGNED_TO_FQN);


    const issuesRequestParams = {
      entitySetId: staffESID,
      filter: {
        entityKeyIds: [currentUserEKID],
        edgeEntitySetIds: [assignedToESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [issueESID]
      },
    };

    const issuesRequest = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(issuesRequestParams)
    );

    if (issuesRequest.error) throw issuesRequest.error;

    const issuesData = fromJS(issuesRequest.data)
      .get(currentUserEKID) || List();

    const myOpenIssues = issuesData
      .map((neighbor) => neighbor.get('neighborDetails') || Map())
      .filter((neighbor) => neighbor.getIn([STATUS_FQN, 0]) === STATUS.OPEN);
    const data = formatIssueRowData(myOpenIssues);

    yield put(getMyOpenIssues.success(action.id, { data }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getMyOpenIssues.failure(action.id));
  }
}

function* getMyOpenIssuesWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_MY_OPEN_ISSUES, getMyOpenIssuesWorker);
}

function* getReportedByMeWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value: currentUserEKID } = action;
    if (!isValidUuid(currentUserEKID)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getReportedByMe.request(action.id));

    const app = yield select((state) => state.get('app', Map()));
    const issueESID = getESIDFromApp(app, ISSUE_FQN);
    const staffESID = getESIDFromApp(app, STAFF_FQN);
    const reportedESID = getESIDFromApp(app, REPORTED_FQN);

    const issuesRequestParams = {
      entitySetId: staffESID,
      filter: {
        entityKeyIds: [currentUserEKID],
        edgeEntitySetIds: [reportedESID],
        destinationEntitySetIds: [issueESID],
        sourceEntitySetIds: []
      }
    };

    const issuesRequest = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(issuesRequestParams)
    );

    if (issuesRequest.error) throw issuesRequest.error;

    const issuesData = fromJS(issuesRequest.data)
      .get(currentUserEKID, List())
      .map((neighbor) => neighbor.get('neighborDetails') || Map());

    const reportedByMe = formatIssueRowData(issuesData);

    yield put(getReportedByMe.success(action.id, {
      data: reportedByMe
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getReportedByMe.failure(action.id));
  }
}

function* getReportedByMeWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_REPORTED_BY_ME, getReportedByMeWorker);
}

function* getAllIssuesWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    yield put(getAllIssues.request(action.id));

    const app = yield select((state) => state.get('app', Map()));
    const issueESID = getESIDFromApp(app, ISSUE_FQN);
    const completedPTID :UUID = yield select((state) => state.getIn(['edm', 'fqnToIdMap', COMPLETED_DT_FQN]));

    const searchOptions = {
      start: 0,
      entitySetIds: [issueESID],
      maxHits: 10000,
      constraints: [{
        constraints: [{
          searchTerm: '*'
        }]
      }],
      sort: {
        propertyTypeId: completedPTID,
        type: 'field'
      }
    };

    const issuesResponse = yield call(
      executeSearchWorker,
      executeSearch({ searchOptions })
    );

    if (issuesResponse.error) throw issuesResponse.error;
    const allIssues = fromJS(issuesResponse.data);
    const data = formatIssueRowData(allIssues.get('hits'));

    yield put(getAllIssues.success(action.id, { data }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getAllIssues.failure(action.id));
  }
}

function* getAllIssuesWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_ALL_ISSUES, getAllIssuesWorker);
}

export {
  getAllIssuesWatcher,
  getAllIssuesWorker,
  getMyOpenIssuesWatcher,
  getMyOpenIssuesWorker,
  getReportedByMeWatcher,
  getReportedByMeWorker,
};
