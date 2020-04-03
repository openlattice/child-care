// @flow

import { RequestStates } from 'redux-reqseq';
import { Set, Map, fromJS } from 'immutable';
import type { SequenceAction } from 'redux-reqseq';

import { getAuthorization } from './AuthorizeActions';

const INITIAL_STATE :Map = fromJS({
  currentPrincipalIds: Set(),
  fetchState: RequestStates.PENDING
});

const AuthorizeReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {
    case getAuthorization.case(action.type): {
      return getAuthorization.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .set('currentPrincipalIds', action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    default:
      return state;
  }
};

export default AuthorizeReducer;
