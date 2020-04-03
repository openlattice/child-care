// @flow

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  SELECT_PERSON,
  getPersonData,
} from '../actions/PersonActions';
import { updateProfileAbout } from '../actions/ProfileActions';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  updateState: RequestStates.STANDBY,
  data: Map()
});

const personReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {
    case getPersonData.case(action.type): {
      return getPersonData.reducer(state, action, {
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
          const { updatedPerson } = action.value;
          return state
            .set('updateState', RequestStates.SUCCESS)
            .set('data', updatedPerson);
        },
        FAILURE: () => state.set('updateState', RequestStates.FAILURE),
      });
    }

    case SELECT_PERSON:
      return state.set('data', fromJS(action.value));

    default:
      return state;
  }
};

export default personReducer;
