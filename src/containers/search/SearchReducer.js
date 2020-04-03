/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';

import {
  CLEAR_CONSUMER_SEARCH_RESULTS,
  searchConsumers,
} from './SearchActionFactory';

const INITIAL_STATE :Map<*, *> = fromJS({
  consumers: {
    isSearching: false,
    searchResults: List(),
    searchComplete: false
  }
});

export default function searchReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case searchConsumers.case(action.type): {
      return searchConsumers.reducer(state, action, {
        REQUEST: () => state
          .setIn(['consumers', 'isSearching'], true)
          .setIn(['consumers', 'searchResults'], List())
          .setIn(['consumers', 'searchComplete'], false),
        SUCCESS: () => state.setIn(['consumers', 'searchResults'], fromJS(action.value.hits)),
        FAILURE: () => state.setIn(['consumers', 'searchResults'], List()),
        FINALLY: () => state.setIn(['consumers', 'isSearching'], false).setIn(['consumers', 'searchComplete'], true)
      });
    }

    case CLEAR_CONSUMER_SEARCH_RESULTS: {
      return state.setIn(['consumers', 'searchResults'], List());
    }

    default:
      return state;
  }
}
