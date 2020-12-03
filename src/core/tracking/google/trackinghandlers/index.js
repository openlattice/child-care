/*
 * @flow
 */

import { LOCATION_CHANGE } from 'connected-react-router';

import {
  GET_GEO_OPTIONS,
  SEARCH_LOCATIONS,
  SEARCH_REFERRAL_AGENCIES,
  SELECT_PROVIDER,
  SELECT_REFERRAL_AGENCY
} from '../../../../containers/location/LocationsActions';
import GeocodeAddress from './GeocodeAddress';
import RouteChange from './RouteChange';
import Search from './Search';
import ViewProvider from './ViewProviderDetails';
import ViewReferralAgency from './ViewReferralAgencyDetails';

export default {
  [GET_GEO_OPTIONS]: GeocodeAddress,
  [LOCATION_CHANGE]: RouteChange,
  [SEARCH_LOCATIONS]: Search,
  [SEARCH_REFERRAL_AGENCIES]: Search,
  [SELECT_PROVIDER]: ViewProvider,
  [SELECT_REFERRAL_AGENCY]: ViewReferralAgency,
};
