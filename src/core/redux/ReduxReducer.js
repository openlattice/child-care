/*
 * @flow
 */

import { connectRouter } from 'connected-react-router/immutable';
import { Map } from 'immutable';
import { AuthReducer } from 'lattice-auth';
import { combineReducers } from 'redux-immutable';

import appReducer from '../../containers/app/AppReducer';

import longBeachReducer from '../../longbeach/LongBeachReducer';
import { INITIALIZE_APPLICATION } from '../../containers/app/AppActions';

export default function reduxReducer(routerHistory :any) {

  const allReducers = combineReducers({
    app: appReducer,
    auth: AuthReducer,
    router: connectRouter(routerHistory),
    longBeach: longBeachReducer,
  });

  const rootReducer = (state :Map, action :Object) => {
    if (action.type === INITIALIZE_APPLICATION) {
      return allReducers(undefined, action);
    }

    return allReducers(state, action);
  };

  return rootReducer;
}
