/*
 * @flow
 */

import { connectRouter } from 'connected-react-router/immutable';
import { Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

import appReducer from '../../containers/app/AppReducer';
import locationsReducer from '../../containers/location/LocationsReducer';

import { INITIALIZE_APPLICATION } from '../../containers/app/AppActions';
import { STATE } from '../../utils/constants/StateConstants';

export default function reduxReducer(routerHistory :any) {

  const allReducers = combineReducers({
    app: appReducer,
    router: connectRouter(routerHistory),
    [STATE.LOCATIONS]: locationsReducer,
  });

  const rootReducer = (state :Map, action :Object) => {
    if (action.type === INITIALIZE_APPLICATION) {
      return allReducers(undefined, action);
    }

    return allReducers(state, action);
  };

  return rootReducer;
}
