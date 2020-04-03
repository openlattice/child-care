// @flow

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  RESET_ISSUE,
  selectIssue,
  setIssueStatus,
  submitIssue,
  updateIssue,
} from './IssueActions';

const INITIAL_STATE :Map = fromJS({
  data: Map(),
  entityIndexToIdMap: Map(),
  fetchState: RequestStates.STANDBY,
  formData: Map(),
  submitState: RequestStates.STANDBY,
  updateState: RequestStates.STANDBY,
});

const IssueReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    case selectIssue.case(action.type): {
      return selectIssue.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .merge(action.value)
          .set('fetchState', RequestStates.SUCCESS),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case submitIssue.case(action.type): {
      return submitIssue.reducer(state, action, {
        REQUEST: () => state.set('submitState', RequestStates.PENDING),
        SUCCESS: () => state.set('submitState', RequestStates.SUCCESS),
        FAILURE: () => state.set('submitState', RequestStates.FAILURE),
      });
    }

    case setIssueStatus.case(action.type): {
      return setIssueStatus.reducer(state, action, {
        REQUEST: () => state.set('updateState', RequestStates.PENDING),
        SUCCESS: () => {
          const { issue } = action.value;
          return state
            .mergeIn(['data', 'issue'], issue)
            .set('updateState', RequestStates.SUCCESS);
        },
        FAILURE: () => state.set('updateState', RequestStates.FAILURE),
      });
    }

    case updateIssue.case(action.type): {
      return updateIssue.reducer(state, action, {
        REQUEST: () => state.set('updateState', RequestStates.PENDING),
        SUCCESS: () => {
          const { assignee, entityIndexToIdMap, issue } = action.value;
          return state
            .mergeIn(['entityIndexToIdMap'], entityIndexToIdMap)
            .mergeIn(['data', 'issue'], issue)
            .mergeIn(['data', 'assignee'], assignee)
            .set('updateState', RequestStates.SUCCESS);
        },
        FAILURE: () => state.set('updateState', RequestStates.FAILURE)
      });
    }

    case RESET_ISSUE: {
      return state
        .set('submitState', RequestStates.STANDBY)
        .set('updateState', RequestStates.STANDBY)
        .set('fetchState', RequestStates.STANDBY);
    }

    default:
      return state;
  }
};

export default IssueReducer;
