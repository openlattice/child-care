// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const ADD_NEW_STAFF_MEMBER :'ADD_NEW_STAFF_MEMBER' = 'ADD_NEW_STAFF_MEMBER';
const addNewStaffMember :RequestSequence = newRequestSequence(ADD_NEW_STAFF_MEMBER);

const GET_CURRENT_USER_STAFF_MEMBER_DATA :'GET_CURRENT_USER_STAFF_MEMBER_DATA' = 'GET_CURRENT_USER_STAFF_MEMBER_DATA';
const getCurrentUserStaffMemberData :RequestSequence = newRequestSequence(GET_CURRENT_USER_STAFF_MEMBER_DATA);

const GET_RESPONSIBLE_USER_OPTIONS :'GET_RESPONSIBLE_USER_OPTIONS' = 'GET_RESPONSIBLE_USER_OPTIONS';
const getResponsibleUserOptions = newRequestSequence(GET_RESPONSIBLE_USER_OPTIONS);

export {
  ADD_NEW_STAFF_MEMBER,
  GET_CURRENT_USER_STAFF_MEMBER_DATA,
  GET_RESPONSIBLE_USER_OPTIONS,
  addNewStaffMember,
  getCurrentUserStaffMemberData,
  getResponsibleUserOptions,
};
