// @flow

import { combineReducers } from 'redux-immutable';
import currentUser from './CurrentUserReducer';
import responsibleUsers from './ResponsibleUsersReducer';

const staffReducer = combineReducers({
  currentUser,
  responsibleUsers,
});

export default staffReducer;
