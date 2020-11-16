/*
 * @flow
 */

import { LOCATION_CHANGE } from 'connected-react-router';

import { SELECT_PROVIDER, SELECT_REFERRAL_AGENCY } from '../../../../containers/location/LocationsActions';
import RouteChange from './RouteChange';
import ViewProvider from './ViewProviderDetails';
import ViewReferralAgency from './ViewReferralAgencyDetails';

export default {
  [LOCATION_CHANGE]: RouteChange,
  [SELECT_PROVIDER]: ViewProvider,
  [SELECT_REFERRAL_AGENCY]: ViewReferralAgency
};
