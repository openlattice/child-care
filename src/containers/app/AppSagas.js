


/*
 * @flow
 */

/* eslint-disable no-use-before-define */
import decode from 'jwt-decode';
import {
  all,
  call,
  put,
  select,
  take,
  takeEvery
} from '@redux-saga/core/effects';
import { get } from 'axios';
import { push } from 'connected-react-router';
import { DataApi, EntitySetsApi, EntityDataModelApi } from 'lattice';
import { configure, AccountUtils } from 'lattice-auth';
import { DateTime } from 'luxon';
import type { SequenceAction } from 'redux-reqseq';

import {
  INITIALIZE_APPLICATION,
  LOAD_APP,
  RELOAD_TOKEN,
  SWITCH_ORGANIZATION,
  initializeApplication,
  loadApp,
  reloadToken
} from './AppActions';

import Logger from '../../utils/Logger';
import * as Routes from '../../core/router/Routes';
import { PROVIDERS_ENTITY_SET, HOSPITALS_ENTITY_SET_ID } from '../../utils/constants/DataModelConstants';
import { ERR_ACTION_VALUE_TYPE, ERR_WORKER_SAGA } from '../../utils/Errors';
import { isValidUuid } from '../../utils/Utils';
import { getCurrentUserStaffMemberData } from '../staff/StaffActions';
import { getCurrentUserStaffMemberDataWorker } from '../staff/StaffSagas';

declare var __AUTH0_CLIENT_ID__;
declare var __AUTH0_DOMAIN__;

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

    const [entitySetId, propertyTypes, hospitals] = yield all([
      call(EntitySetsApi.getEntitySetId, PROVIDERS_ENTITY_SET),
      call(EntityDataModelApi.getAllPropertyTypes),
      call(DataApi.getEntitySetData, HOSPITALS_ENTITY_SET_ID)
    ]);

    yield put(loadApp.success(action.id, { entitySetId, hospitals, propertyTypes }));
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

    const { data: token } = yield call(get, 'https://api.openlattice.com/child-care/explore/token');

    const { exp } = decode(token);
    const tokenExp = exp * 1000;

    configure({
      auth0ClientId: __AUTH0_CLIENT_ID__,
      auth0Domain: __AUTH0_DOMAIN__,
      authToken: token
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
 * switchOrganization()
 */

function* switchOrganizationWatcher() :Generator<*, *, *> {

  yield takeEvery(SWITCH_ORGANIZATION, switchOrganizationWorker);
}

function* switchOrganizationWorker(action :Object) :Generator<*, *, *> {

  try {
    const { value } = action;
    if (!isValidUuid(value)) throw ERR_ACTION_VALUE_TYPE;

    const currentOrgId = yield select((state) => state.getIn(['app', 'selectedOrganizationId']));
    if (value !== currentOrgId) {
      AccountUtils.storeOrganizationId(value);
      yield put(push(Routes.HOME_PATH));
      yield put(initializeApplication());
    }
  }
  catch (error) {
    LOG.error(ERR_WORKER_SAGA, error);
  }
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
    console.error(error);
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
  switchOrganizationWatcher,
};
