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

import * as AboutSagas from '../../containers/profile/edit/about/AboutSagas';
import * as AddressSagas from '../../containers/profile/edit/basicinformation/sagas/AddressSagas';
import * as AppSagas from '../../containers/app/AppSagas';
import * as AppearanceSagas from '../../containers/profile/edit/basicinformation/sagas/AppearanceSagas';
import * as BasicInformationSagas from '../../containers/profile/edit/basicinformation/sagas/BasicInformationSagas';
import * as ContactsSagas from '../../containers/profile/edit/contacts/ContactsSagas';
import * as DownloadsSagas from '../../containers/downloads/DownloadsSagas';
import * as EncampmentSagas from '../../longbeach/location/encampment/EncampmentsSagas';
import * as IssueSagas from '../../containers/issues/issue/IssueSagas';
import * as IssuesSagas from '../../containers/issues/IssuesSagas';
import * as LongBeachLocationsSagas from '../../longbeach/location/stayaway/LongBeachLocationsSagas';
import * as LongBeachPeopleSagas from '../../longbeach/people/LongBeachPeopleSagas';
import * as LongBeachProfileSagas from '../../longbeach/profile/LongBeachProfileSagas';
import * as LongBeachProviderSagas from '../../longbeach/provider/LongBeachProviderSagas';
// eslint-disable-next-line max-len
import * as OfficerSafetyConcernsSagas from '../../containers/profile/edit/officersafety/sagas/OfficerSafetyConcernsSagas';
import * as PeopleSagas from '../../containers/people/PeopleSagas';
import * as PhotosSagas from '../../containers/profile/edit/basicinformation/sagas/PhotosSagas';
import * as ProfileSagas from '../../containers/profile/ProfileSagas';
import * as ResponsePlanSagas from '../../containers/profile/edit/responseplan/ResponsePlanSagas';
import * as RoutingSagas from '../router/RoutingSagas';
import * as ScarsMarksTattoosSagas from '../../containers/profile/edit/basicinformation/sagas/ScarsMarksTattoosSagas';
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
    fork(AppSagas.switchOrganizationWatcher),

    // AuthorizeSagas
    fork(AuthorizeSagas.getAuthorizationWatcher),

    // RoutingSagas
    fork(RoutingSagas.goToRootWatcher),
    fork(RoutingSagas.goToPathWatcher),

    // SearchSagas
    fork(SearchSagas.searchConsumersWatcher),

    /* <===== BEGIN LONG BEACH HACK =====> */
    fork(LongBeachPeopleSagas.searchLBPeopleWatcher),
    fork(LongBeachPeopleSagas.getLBPeopleStayAwayWatcher),
    fork(LongBeachPeopleSagas.getLBStayAwayLocationsWatcher),
    fork(LongBeachPeopleSagas.getLBPeoplePhotosWatcher),

    fork(LongBeachLocationsSagas.getGeoOptionsWatcher),
    fork(LongBeachLocationsSagas.searchLBLocationsWatcher),

    fork(LongBeachProfileSagas.getLBProfileWatcher),
    fork(LongBeachProfileSagas.getLBProfileNeighborsWatcher),

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
