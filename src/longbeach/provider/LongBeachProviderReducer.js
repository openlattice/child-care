// @flow
import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import { getLBProviders } from './LongBeachProviderActions';

const providers = List().setSize(9).withMutations((mutable) => {
  mutable.forEach((_, idx) => {
    mutable.set(idx, Map());
  });
});

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  providers
});

const longBeachProfileReducer = (state :Map = INITIAL_STATE, action :Object) => {

  switch (action.type) {

    case getLBProviders.case(action.type): {
      return getLBProviders.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    default:
      return state;
  }

};

export default longBeachProfileReducer;
