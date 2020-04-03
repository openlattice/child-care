/*
 * @flow
 */

import Immutable from 'immutable';

import { downloadForms } from './DownloadsActionFactory';


const INITIAL_STATE :Immutable.Map<*, *> = Immutable.Map().withMutations((map :Immutable.Map<*, *>) => {
  map.set('downloading', false);
});

function reducer(state :Immutable.Map<*, *> = INITIAL_STATE, action :Object) {
  switch (action.type) {

    case downloadForms.case(action.type): {
      return downloadForms.reducer(state, action, {
        REQUEST: () => state.set('downloading', true),
        FINALLY: () => state.set('downloading', false)
      });
    }

    default:
      return state;
  }
}

export default reducer;
