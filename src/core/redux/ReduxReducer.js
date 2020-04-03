/*
 * @flow
 */

import { connectRouter } from 'connected-react-router/immutable';
import { Map } from 'immutable';
import { AuthReducer } from 'lattice-auth';
import { combineReducers } from 'redux-immutable';

import appReducer from '../../containers/app/AppReducer';
import authorizeReducer from '../sagas/authorize/AuthorizeReducer';
import dashboardReducer from '../../containers/dashboard/DashboardReducer';
// pages
import dispositionReducer from '../../containers/pages/disposition/Reducer';
import downloadsReducer from '../../containers/downloads/DownloadsReducer';
import edmReducer from '../../edm/EdmReducer';
import issuesReducer from '../../containers/issues/IssuesReducer';
import longBeachReducer from '../../longbeach/LongBeachReducer';
import natureOfCrisisReducer from '../../containers/pages/natureofcrisis/Reducer';
import observedBehaviorsReducer from '../../containers/pages/observedbehaviors/Reducer';
import officerSafetyReducer from '../../containers/pages/officersafety/Reducer';
import peopleReducer from '../../containers/people/PeopleReducer';
import profileReducer from '../../containers/profile/reducers/ProfileReducer';
import searchReducer from '../../containers/search/SearchReducer';
import staffReducer from '../../containers/staff/StaffReducer';
import subjectInformationReducer from '../../containers/pages/subjectinformation/Reducer';
import { INITIALIZE_APPLICATION } from '../../containers/app/AppActions';
import { STATE } from '../../utils/constants/StateConstants';

export default function reduxReducer(routerHistory :any) {

  const allReducers = combineReducers({
    app: appReducer,
    auth: AuthReducer,
    authorization: authorizeReducer,
    dashboard: dashboardReducer,
    downloads: downloadsReducer,
    edm: edmReducer,
    issues: issuesReducer,
    people: peopleReducer,
    profile: profileReducer,
    router: connectRouter(routerHistory),
    search: searchReducer,
    staff: staffReducer,
    longBeach: longBeachReducer,

    // page reducers
    [STATE.DISPOSITION]: dispositionReducer,
    [STATE.NATURE_OF_CRISIS]: natureOfCrisisReducer,
    [STATE.OBSERVED_BEHAVIORS]: observedBehaviorsReducer,
    [STATE.OFFICER_SAFETY]: officerSafetyReducer,
    [STATE.SUBJECT_INFORMATION]: subjectInformationReducer,
  });

  const rootReducer = (state :Map, action :Object) => {
    if (action.type === INITIALIZE_APPLICATION) {
      return allReducers(undefined, action);
    }

    return allReducers(state, action);
  };

  return rootReducer;
}
