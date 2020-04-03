// @flow

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  getAllIssues,
  getMyOpenIssues,
  getReportedByMe,
} from './IssuesActions';
import {
  selectIssue,
  setIssueStatus,
  updateIssue,
} from './issue/IssueActions';

import { OPENLATTICE_ID_FQN } from '../../edm/DataModelFqns';

const INITIAL_STATE :Map = fromJS({
  data: List(),
  subjectsByEKID: Map(),
  subjectEKIDsByIssueEKID: Map(),
  fetchState: RequestStates.STANDBY,
});

const updateIssueRow = (state :Map, issue :Map) => {
  const issueEKID = issue.getIn([OPENLATTICE_ID_FQN, 0]);
  const issueIndex = state
    .get('data')
    .findIndex((issueRow) => issueRow.get(OPENLATTICE_ID_FQN) === issueEKID);

  const rowData = issue.map((details) => details.get(0));

  if (issueIndex > -1) {
    return state.mergeDeepIn(['data', issueIndex], rowData);
  }

  return state;
};

const FilteredIssues = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    case getReportedByMe.case(action.type): {
      return getReportedByMe.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case getMyOpenIssues.case(action.type): {
      return getMyOpenIssues.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case getAllIssues.case(action.type): {
      return getAllIssues.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case setIssueStatus.case(action.type): {
      return setIssueStatus.reducer(state, action, {
        SUCCESS: () => {
          const { issue } = action.value;

          return updateIssueRow(state, issue);
        },
      });
    }

    case selectIssue.case(action.type): {
      return selectIssue.reducer(state, action, {
        SUCCESS: () => {
          const { data } = action.value;
          const issue :Map = data.get('issue');

          return updateIssueRow(state, issue);
        },
      });
    }

    case updateIssue.case(action.type): {
      return updateIssue.reducer(state, action, {
        SUCCESS: () => {
          const { issue } = action.value;

          return updateIssueRow(state, issue);
        },
      });
    }

    default:
      return state;
  }
};

export default FilteredIssues;
