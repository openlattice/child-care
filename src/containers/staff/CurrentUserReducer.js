// @flow
import { RequestStates } from 'redux-reqseq';
import { Map, fromJS } from 'immutable';
import type { SequenceAction } from 'redux-reqseq';

import { getCurrentUserStaffMemberData } from './StaffActions';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  data: Map(),
});

const currentUserReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    case getCurrentUserStaffMemberData.case(action.type): {
      return getCurrentUserStaffMemberData.reducer(state, action, {
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

export default currentUserReducer;
