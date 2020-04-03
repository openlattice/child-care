// @flow

import { fromJS } from 'immutable';
import {
  call,
  put,
  select,
  takeLatest,
} from '@redux-saga/core/effects';

import {
  PrincipalsApiActions,
  PrincipalsApiSagas
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import Logger from '../../../utils/Logger';
import { GET_AUTHORIZATION, getAuthorization } from './AuthorizeActions';

const { getCurrentRolesWorker } = PrincipalsApiSagas;
const { getCurrentRoles } = PrincipalsApiActions;

const LOG = new Logger('AuthorizeSagas');

function* getAuthorizationWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    yield put(getAuthorization.request(action.id));

    const currentRolesResponse = yield call(getCurrentRolesWorker, getCurrentRoles());
    if (currentRolesResponse.error) throw currentRolesResponse.error;

    const currentRoles = fromJS(currentRolesResponse.data);

    const selectedOrganizationID :UUID = yield select((state) => state.getIn(['app', 'selectedOrganizationId']));
    const rolesByOrganization = currentRoles.filter((role) => role.get('organizationId') === selectedOrganizationID);
    const roleIds = rolesByOrganization.map((role) => role.get('id')).toSet();
    yield put(getAuthorization.success(action.id, roleIds));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getAuthorization.failure(action.id));
  }
  return response;
}

function* getAuthorizationWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_AUTHORIZATION, getAuthorizationWorker);
}

export {
  getAuthorizationWatcher,
  getAuthorizationWorker,
};
