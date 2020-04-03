// @flow
import { RequestStates } from 'redux-reqseq';
import { Map, List, fromJS } from 'immutable';
import type { SequenceAction } from 'redux-reqseq';

import { getResponsibleUserOptions } from './StaffActions';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  data: List(),
});

const responsibleUsersReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    case getResponsibleUserOptions.case(action.type): {
      return getResponsibleUserOptions.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .set('data', fromJS(action.value)),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    default:
      return state;
  }
};

export default responsibleUsersReducer;
