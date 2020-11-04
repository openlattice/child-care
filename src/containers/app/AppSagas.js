/*
 * @flow
 */

/* eslint-disable no-use-before-define */

import axios from 'axios';
import decode from 'jwt-decode';
import {
  call,
  put,
  select,
  take,
  takeEvery
} from '@redux-saga/core/effects';
import { configure } from 'lattice';
import { DateTime } from 'luxon';
import type { RequestSequence, SequenceAction } from 'redux-reqseq';

import {
  INITIALIZE_APPLICATION,
  LOAD_APP,
  RELOAD_TOKEN,
  initializeApplication,
  loadApp,
  reloadToken
} from './AppActions';

import Logger from '../../utils/Logger';
import PROPERTY_TYPE_LIST from '../../utils/constants/PropertyTypes';
import { ERR_WORKER_SAGA } from '../../utils/Errors';
import { BASE_URL, PROVIDERS_ENTITY_SET_ID } from '../../utils/constants/DataModelConstants';

const LOG = new Logger('AppSagas');

/*
 *
 * sagas
 *
 */

/*
 * loadApp()
 */

function* loadAppWatcher() :Generator<*, *, *> {

  yield takeEvery(LOAD_APP, loadAppWorker);
}

function* loadAppWorker(action :SequenceAction) :Generator<*, *, *> {

  const workerResponse :Object = {};
  try {
    yield put(loadApp.request(action.id));

    yield call(refreshAuthTokenIfNecessary);

    const propertyTypes = PROPERTY_TYPE_LIST;
    const entitySetId = PROVIDERS_ENTITY_SET_ID;

    yield put(loadApp.success(action.id, { entitySetId, propertyTypes }));
  }
  catch (error) {
    LOG.error(action.type, error);
    workerResponse.error = error;
    yield put(loadApp.failure(action.id, error));
  }
  finally {
    yield put(loadApp.finally(action.id));
  }

  return workerResponse;
}

/*
 * reloadToken()
 */

export function* reloadTokenWatcher() :Generator<*, *, *> {

  yield takeEvery(RELOAD_TOKEN, reloadTokenWorker);
}

function* reloadTokenWorker(action :SequenceAction) :Generator<*, *, *> {

  const workerResponse :Object = {};
  try {
    yield put(reloadToken.request(action.id));

    const { data: token } = yield call(axios.get, 'https://api.openlattice.com/child-care/explore/token');

    const { exp } = decode(token);
    const tokenExp = exp * 1000;

    configure({
      authToken: token,
      baseUrl: BASE_URL
    });
    yield put(reloadToken.success(action.id, { token, tokenExp }));
  }
  catch (error) {
    LOG.error(action.type, error);
    workerResponse.error = error;
    yield put(reloadToken.failure(action.id, error));
  }
  finally {
    yield put(reloadToken.finally(action.id));
  }

  return workerResponse;
}

/*
 * initializeApplication()
 */

function* initializeApplicationWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(initializeApplication.request(action.id));

    // Load app and property types
    yield call(loadAppWorker, loadApp());

    yield put(initializeApplication.success(action.id));
  }
  catch (error) {
    LOG.error(ERR_WORKER_SAGA, error);
    yield put(initializeApplication.failure(action.id, error));
  }
  finally {
    yield put(initializeApplication.finally(action.id));
  }
}

function* initializeApplicationWatcher() :Generator<*, *, *> {

  yield takeEvery(INITIALIZE_APPLICATION, initializeApplicationWorker);
}

function takeReqSeqSuccessFailure(reqseq :RequestSequence, seqAction :SequenceAction) {
  return take(
    (anAction :Object) => (anAction.type === reqseq.SUCCESS && anAction.id === seqAction.id)
        || (anAction.type === reqseq.FAILURE && anAction.id === seqAction.id)
  );
}

export function* refreshAuthTokenIfNecessary() :Generator<*, *, *> {

  try {
    const token = yield select((state) => state.getIn(['app', 'token']));
    const expiration = yield select((state) => state.getIn(['app', 'tokenExp']));
    const oneMinuteFromNow = DateTime.local().plus({ minutes: 1 }).valueOf();

    if (!token || oneMinuteFromNow > expiration) {
      const reloadTokenRequest = reloadToken();
      yield put(reloadTokenRequest);
      yield takeReqSeqSuccessFailure(reloadToken, reloadTokenRequest);
    }
  }
  catch (error) {
    LOG.error('refreshAuthTokenIfNecessary', error);
  }
}

/*
 *
 * exports
 *
 */

export {
  initializeApplicationWatcher,
  loadAppWatcher,
};
