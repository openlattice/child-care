// @flow
import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  getAddress,
  updateAddress,
  submitAddress,
} from '../actions/AddressActions';

const INITIAL_STATE :Map = fromJS({
  entityIndexToIdMap: Map(),
  fetchState: RequestStates.STANDBY,
  formData: Map(),
  updateState: RequestStates.STANDBY,
});

const addressReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {

  switch (action.type) {

    case getAddress.case(action.type): {
      return getAddress.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .merge(action.value)
          .set('fetchState', RequestStates.SUCCESS),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    case submitAddress.case(action.type): {
      return submitAddress.reducer(state, action, {
        REQUEST: () => state.set('submitState', RequestStates.PENDING),
        SUCCESS: () => {
          const {
            entityIndexToIdMap,
            path,
            properties,
          } = action.value;
          return state
            .set('entityIndexToIdMap', entityIndexToIdMap)
            .setIn(['formData', ...path], fromJS(properties))
            .set('submitState', RequestStates.SUCCESS);
        },
        FAILURE: () => state.set('submitState', RequestStates.FAILURE)
      });
    }

    case updateAddress.case(action.type): {
      return updateAddress.reducer(state, action, {
        REQUEST: () => {
          const { path, properties } = action.value;
          return state
            .set('updateState', RequestStates.PENDING)
            .setIn(['formData', ...path], fromJS(properties));
        },
        SUCCESS: () => state.set('updateState', RequestStates.SUCCESS),
        FAILURE: () => state.set('updateState', RequestStates.FAILURE)
      });
    }

    default:
      return state;
  }
};

export default addressReducer;
