/*
 * @flow
 */

import { all, fork } from '@redux-saga/core/effects';
import {
  AppApiSagas,
  DataApiSagas,
  EntityDataModelApiSagas,
  SearchApiSagas,
} from 'lattice-sagas';

import * as AppSagas from '../../containers/app/AppSagas';
import * as LocationsSagas from '../../containers/location/LocationsSagas';
// eslint-disable-next-line max-len
import * as RoutingSagas from '../router/RoutingSagas';

export default function* sagas() :Generator<*, *, *> {

  yield all([

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
    fork(AppSagas.reloadTokenWatcher),

    // LocationsSagas
    fork(LocationsSagas.getGeoOptionsWatcher),
    fork(LocationsSagas.searchLocationsWatcher),

    // RoutingSagas
    fork(RoutingSagas.goToRootWatcher),
    fork(RoutingSagas.goToPathWatcher),

  ]);
}
