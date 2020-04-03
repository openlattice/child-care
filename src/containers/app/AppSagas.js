/*
 * @flow
 */

/* eslint-disable no-use-before-define */
import {
  all,
  call,
  put,
  select,
  takeEvery
} from '@redux-saga/core/effects';
import { push } from 'connected-react-router';
import { Map, fromJS } from 'immutable';
import { EntitySetsApi, EntityDataModelApi, Constants, Types } from 'lattice';
import { AccountUtils } from 'lattice-auth';
import {
  AppApiActions,
  AppApiSagas,
  DataApiActions,
  DataApiSagas,
  EntityDataModelApiActions,
  EntityDataModelApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  INITIALIZE_APPLICATION,
  LOAD_APP,
  SWITCH_ORGANIZATION,
  initializeApplication,
  loadApp,
} from './AppActions';

import Logger from '../../utils/Logger';
import * as Routes from '../../core/router/Routes';
import { PROVIDERS_ENTITY_SET } from '../../utils/constants/DataModelConstants';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { ERR_ACTION_VALUE_TYPE, ERR_WORKER_SAGA } from '../../utils/Errors';
import { isValidUuid } from '../../utils/Utils';
import { getCurrentUserStaffMemberData } from '../staff/StaffActions';
import { getCurrentUserStaffMemberDataWorker } from '../staff/StaffSagas';

const { OPENLATTICE_ID_FQN } = Constants;
const { SecurableTypes } = Types;
const { getApp, getAppConfigs, getAppTypes } = AppApiActions;
const { getAppWorker, getAppConfigsWorker, getAppTypesWorker } = AppApiSagas;
const { getEntityDataModelProjection, getAllPropertyTypes } = EntityDataModelApiActions;
const { getEntityDataModelProjectionWorker, getAllPropertyTypesWorker } = EntityDataModelApiSagas;
const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;
const { searchEntitySetData } = SearchApiActions;
const { searchEntitySetDataWorker } = SearchApiSagas;

const { HOSPITALS_FQN, APP_SETTINGS_FQN } = APP_TYPES_FQNS;

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

    const [entitySetId, propertyTypes] = yield all([
      call(EntitySetsApi.getEntitySetId, PROVIDERS_ENTITY_SET),
      call(EntityDataModelApi.getAllPropertyTypes),
    ]);

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
    const phaseOneResponse = yield all([
      call(loadAppWorker, loadApp()),
      call(getAllPropertyTypesWorker, getAllPropertyTypes())
    ]);

    const phaseOneErrors = phaseOneResponse.reduce((acc, response) => {
      if (response.error) {
        acc.push(response.error);
      }
      return acc;
    }, []);

    if (phaseOneErrors.length) throw phaseOneErrors;

    // The following requests require the completion of phase one requests
    // Get/create current user staff entity
    const staffRequest = yield call(
      getCurrentUserStaffMemberDataWorker,
      getCurrentUserStaffMemberData({ createIfNotExists: true })
    );

    const phaseTwoResponse = yield all([
      staffRequest,
      // hospitalRequest
    ]);

    const phaseTwo = phaseTwoResponse.reduce((acc, response) => {
      if (response.error) {
        acc.push(response.error);
      }
      return acc;
    }, []);

    if (phaseTwo.length) throw phaseTwo;

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
