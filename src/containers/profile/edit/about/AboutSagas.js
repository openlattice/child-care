// @flow
import {
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_ABOUT_PLAN,
  GET_RESPONSIBLE_USER,
  SUBMIT_ABOUT_PLAN,
  UPDATE_ABOUT_PLAN,
} from './AboutActions';

function* getResponsibleUserWorker(action :SequenceAction) :Generator<any, any, any> {
}

function* getResponsibleUserWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_RESPONSIBLE_USER, getResponsibleUserWorker);
}

function* getAboutPlanWorker(action :SequenceAction) :Generator<any, any, any> {
}

function* getAboutPlanWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_ABOUT_PLAN, getAboutPlanWorker);
}

function* updateAboutPlanWorker(action :SequenceAction) :Generator<any, any, any> {
}

function* updateAboutPlanWatcher() :Generator<any, any, any> {
  yield takeEvery(UPDATE_ABOUT_PLAN, updateAboutPlanWorker);
}

function* submitAboutPlanWorker(action :SequenceAction) :Generator<any, any, any> {
}

function* submitAboutPlanWatcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_ABOUT_PLAN, submitAboutPlanWorker);
}

export {
  getAboutPlanWatcher,
  getAboutPlanWorker,
  getResponsibleUserWatcher,
  getResponsibleUserWorker,
  submitAboutPlanWatcher,
  submitAboutPlanWorker,
  updateAboutPlanWatcher,
  updateAboutPlanWorker,
};
