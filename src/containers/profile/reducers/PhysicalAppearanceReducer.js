// @flow

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import { getPhysicalAppearance } from '../actions/PhysicalAppearanceActions';
import { updateProfileAbout } from '../actions/ProfileActions';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  updateState: RequestStates.STANDBY,
  data: Map()
});

const physicalAppearanceReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    case getPhysicalAppearance.case(action.type): {
      return getPhysicalAppearance.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .set('data', action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case updateProfileAbout.case(action.type): {
      return updateProfileAbout.reducer(state, action, {
        REQUEST: () => state.set('updateState', RequestStates.PENDING),
        SUCCESS: () => {
          const { updatedPhysicalAppearance } = action.value;
          return state
            .set('updateState', RequestStates.SUCCESS)
            .set('data', updatedPhysicalAppearance);
        },
        FAILURE: () => state.set('updateState', RequestStates.FAILURE),
      });
    }

    default:
      return state;
  }

};

export default physicalAppearanceReducer;
