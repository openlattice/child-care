// @flow

import { Map } from 'immutable';
import { combineReducers } from 'redux-immutable';

import person from './PersonReducer';
import physicalAppearance from './PhysicalAppearanceReducer';

import basicInformation from '../edit/basicinformation/reducers/BasicInformationReducer';
import contacts from '../edit/contacts/ContactsReducer';
import officerSafety from '../edit/officersafety/reducers/OfficerSafetyReducer';
import { CLEAR_PROFILE } from '../ProfileActions';

const subReducers = combineReducers({
  basicInformation,
  contacts,
  officerSafety,
  person,
  physicalAppearance,
});

const profileReducer = (state :Map, action :Object) => {
  if (action.type === CLEAR_PROFILE) {
    return subReducers(undefined, action);
  }

  return subReducers(state, action);
};

export default profileReducer;
