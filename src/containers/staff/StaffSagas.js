/*
 * @flow
 */

import {
  takeEvery,
} from '@redux-saga/core/effects';
import type { SequenceAction } from 'redux-reqseq';

import {
  ADD_NEW_STAFF_MEMBER,
  GET_CURRENT_USER_STAFF_MEMBER_DATA,
  GET_RESPONSIBLE_USER_OPTIONS
} from './StaffActions';

/*
 *
 * StaffSagas.addNewStaffMember()
 *
 */

function* addNewStaffMemberWorker(action :SequenceAction) :Generator<*, *, *> {
}

function* addNewStaffMemberWatcher() :Generator<*, *, *> {

  yield takeEvery(ADD_NEW_STAFF_MEMBER, addNewStaffMemberWorker);
}

/*
 *
 * StaffSagas.getCurrentUserStaffMemberData()
 *
 */

function* getCurrentUserStaffMemberDataWorker(action :SequenceAction) :Generator<*, *, *> {
}

function* getCurrentUserStaffMemberDataWatcher() :Generator<*, *, *> {

  yield takeEvery(GET_CURRENT_USER_STAFF_MEMBER_DATA, getCurrentUserStaffMemberDataWorker);
}

function* getResponsibleUserOptionsWorker(action :SequenceAction) :Generator<any, any, any> {
}

function* getResponsibleUserOptionsWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_RESPONSIBLE_USER_OPTIONS, getResponsibleUserOptionsWorker);
}

export {
  addNewStaffMemberWatcher,
  addNewStaffMemberWorker,
  getCurrentUserStaffMemberDataWatcher,
  getCurrentUserStaffMemberDataWorker,
  getResponsibleUserOptionsWatcher,
  getResponsibleUserOptionsWorker,
};
