/*
 * @flow
 */

import { all, fork } from '@redux-saga/core/effects';

import * as AppSagas from '../../containers/app/AppSagas';
import * as LocationsSagas from '../../containers/location/LocationsSagas';
// eslint-disable-next-line max-len
import * as RoutingSagas from '../router/RoutingSagas';

export default function* sagas() :Generator<*, *, *> {

  yield all([
    // AppSagas
    fork(AppSagas.initializeApplicationWatcher),
    fork(AppSagas.loadAppWatcher),
    fork(AppSagas.reloadTokenWatcher),

    // LocationsSagas
    fork(LocationsSagas.geocodePlaceWatcher),
    fork(LocationsSagas.getGeoOptionsWatcher),
    fork(LocationsSagas.searchLocationsWatcher),
    fork(LocationsSagas.loadCurrentPositionWatcher),

    // RoutingSagas
    fork(RoutingSagas.goToRootWatcher),
    fork(RoutingSagas.goToPathWatcher),

  ]);
}
