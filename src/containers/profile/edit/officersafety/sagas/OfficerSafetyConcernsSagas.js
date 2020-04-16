// @flow
import {
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import type { SequenceAction } from 'redux-reqseq';

import {
  DELETE_OFFICER_SAFETY_CONCERNS,
  GET_OFFICER_SAFETY,
  GET_OFFICER_SAFETY_CONCERNS,
  SUBMIT_OFFICER_SAFETY_CONCERNS,
  UPDATE_OFFICER_SAFETY_CONCERNS,
} from '../OfficerSafetyActions';

function* getOfficerSafetyConcernsWorker(action :SequenceAction) :Generator<any, any, any> {
}

function* getOfficerSafetyConcernsWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_OFFICER_SAFETY_CONCERNS, getOfficerSafetyConcernsWorker);
}


function* getOfficerSafetyWorker(action :SequenceAction) :Generator<any, any, any> {
}

function* getOfficerSafetyWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_OFFICER_SAFETY, getOfficerSafetyWorker);
}

function* submitOfficerSafetyConcernsWorker(action :SequenceAction) :Generator<any, any, any> {
}

function* submitOfficerSafetyConcernsWatcher() :Generator<any, any, any> {
  yield takeLatest(SUBMIT_OFFICER_SAFETY_CONCERNS, submitOfficerSafetyConcernsWorker);
}

function* updateOfficerSafetyConcernsWorker(action :SequenceAction) :Generator<*, *, *> {
}

function* updateOfficerSafetyConcernsWatcher() :Generator<*, *, *> {
  yield takeEvery(UPDATE_OFFICER_SAFETY_CONCERNS, updateOfficerSafetyConcernsWorker);
}

function* deleteOfficerSafetyConcernsWorker(action :SequenceAction) :Generator<*, *, *> {
}

function* deleteOfficerSafetyConcernsWatcher() :Generator<*, *, *> {
  yield takeEvery(DELETE_OFFICER_SAFETY_CONCERNS, deleteOfficerSafetyConcernsWorker);
}

export {
  deleteOfficerSafetyConcernsWatcher,
  deleteOfficerSafetyConcernsWorker,
  getOfficerSafetyConcernsWatcher,
  getOfficerSafetyConcernsWorker,
  getOfficerSafetyWatcher,
  getOfficerSafetyWorker,
  submitOfficerSafetyConcernsWatcher,
  submitOfficerSafetyConcernsWorker,
  updateOfficerSafetyConcernsWatcher,
  updateOfficerSafetyConcernsWorker,
};
