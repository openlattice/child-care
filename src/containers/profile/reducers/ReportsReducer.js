// @flow

import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { getIncidentReportsSummary, getProfileReports } from '../actions/ReportActions';

const INITIAL_STATE :Map = fromJS({
  behaviorSummary: Map(),
  crisisSummary: Map(),
  data: List(),
  fetchState: RequestStates.STANDBY,
  lastIncidentReports: List(),
  lastInicdent: Map(),
  lastReporters: Map(),
});

const reportsReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    case getProfileReports.case(action.type): {
      return getProfileReports.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case getIncidentReportsSummary.case(action.type): {
      return getIncidentReportsSummary.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    default:
      return state;
  }
};

export default reportsReducer;
