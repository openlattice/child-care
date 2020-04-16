/*
 * @flow
 */

import { connectRouter } from 'connected-react-router/immutable';
import { Map } from 'immutable';
import { AuthReducer } from 'lattice-auth';
import { combineReducers } from 'redux-immutable';

import appReducer from '../../containers/app/AppReducer';
import authorizeReducer from '../sagas/authorize/AuthorizeReducer';

import downloadsReducer from '../../containers/downloads/DownloadsReducer';
import edmReducer from '../../edm/EdmReducer';
import longBeachReducer from '../../longbeach/LongBeachReducer';
import peopleReducer from '../../containers/people/PeopleReducer';
import profileReducer from '../../containers/profile/reducers/ProfileReducer';
import searchReducer from '../../containers/search/SearchReducer';
import staffReducer from '../../containers/staff/StaffReducer';
import { INITIALIZE_APPLICATION } from '../../containers/app/AppActions';

export default function reduxReducer(routerHistory :any) {

  const allReducers = combineReducers({
    app: appReducer,
    auth: AuthReducer,
    authorization: authorizeReducer,
    downloads: downloadsReducer,
    edm: edmReducer,
    people: peopleReducer,
    profile: profileReducer,
    router: connectRouter(routerHistory),
    search: searchReducer,
    staff: staffReducer,
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
