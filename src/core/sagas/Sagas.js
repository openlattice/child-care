/*
 * @flow
 */

import { all, fork } from '@redux-saga/core/effects';
import { AuthSagas } from 'lattice-auth';
import {
  AppApiSagas,
  DataApiSagas,
  EntityDataModelApiSagas,
  SearchApiSagas,
} from 'lattice-sagas';

import * as AuthorizeSagas from './authorize/AuthorizeSagas';

import * as AppSagas from '../../containers/app/AppSagas';
import * as EncampmentSagas from '../../containers/location/encampment/EncampmentsSagas';
import * as LocationsSagas from '../../containers/location/LocationsSagas';
import * as LongBeachProviderSagas from '../../longbeach/provider/LongBeachProviderSagas';
// eslint-disable-next-line max-len
import * as RoutingSagas from '../router/RoutingSagas';
import * as SearchSagas from '../../containers/search/SearchSagas';

export default function* sagas() :Generator<*, *, *> {

  yield all([
    // "lattice-auth" sagas
    fork(AuthSagas.watchAuthAttempt),
    fork(AuthSagas.watchAuthSuccess),
    fork(AuthSagas.watchAuthFailure),
    fork(AuthSagas.watchAuthExpired),
    fork(AuthSagas.watchLogout),

    // "lattice-sagas" sagas
    fork(AppApiSagas.getAppConfigsWatcher),
    fork(AppApiSagas.getAppTypesWatcher),
    fork(AppApiSagas.getAppWatcher),
    fork(DataApiSagas.deleteEntityDataWatcher),
    fork(DataApiSagas.getEntitySetDataWatcher),
    fork(DataApiSagas.updateEntityDataWatcher),
    fork(EntityDataModelApiSagas.getAllPropertyTypesWatcher),
    fork(EntityDataModelApiSagas.getEntityDataModelProjectionWatcher),
    fork(SearchApiSagas.searchEntitySetDataWatcher),

    // AppSagas
    fork(AppSagas.initializeApplicationWatcher),
    fork(AppSagas.loadAppWatcher),

    // AuthorizeSagas
    fork(AuthorizeSagas.getAuthorizationWatcher),

    // LocationsSagas
    fork(LocationsSagas.getGeoOptionsWatcher),
    fork(LocationsSagas.searchLocationsWatcher),

    // RoutingSagas
    fork(RoutingSagas.goToRootWatcher),
    fork(RoutingSagas.goToPathWatcher),

    // SearchSagas
    fork(SearchSagas.searchConsumersWatcher),

    /* <===== BEGIN LONG BEACH HACK =====> */

    fork(LongBeachProviderSagas.getLBProvidersWatcher),
    /* <===== END LONG BEACH HACK =====> */

    fork(EncampmentSagas.addPersonToEncampmentWatcher),
    fork(EncampmentSagas.getEncampmentOccupantsWatcher),
    fork(EncampmentSagas.getEncampmentPeopleOptionsWatcher),
    fork(EncampmentSagas.getGeoOptionsWatcher),
    fork(EncampmentSagas.removePersonFromEncampmentWatcher),
    fork(EncampmentSagas.searchEncampmentLocationsWatcher),
    fork(EncampmentSagas.submitEncampmentWatcher),
  ]);
}
