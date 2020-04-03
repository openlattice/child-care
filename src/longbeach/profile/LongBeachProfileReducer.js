// @flow
import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  CLEAR_LB_PROFILE,
  SELECT_LB_PROFILE,
  getLBProfile
} from './LongBeachProfileActions';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  person: Map(),
  probation: Map(),
  profilePicture: Map(),
  stayAway: Map(),
  stayAwayLocation: Map(),
  submitState: RequestStates.STANDBY,
  warrant: Map()
});

const longBeachProfileReducer = (state :Map = INITIAL_STATE, action :Object) => {

  switch (action.type) {

    case getLBProfile.case(action.type): {
      return getLBProfile.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    case SELECT_LB_PROFILE: {
      return state.merge(action.value);
    }

    case CLEAR_LB_PROFILE: {
      return INITIAL_STATE;
    }

    default:
      return state;
  }

};

export default longBeachProfileReducer;
