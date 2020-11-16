/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

export const SEARCH_LOCATIONS :'SEARCH_LOCATIONS' = 'SEARCH_LOCATIONS';
export const searchLocations :RequestSequence = newRequestSequence(SEARCH_LOCATIONS);

export const SEARCH_REFERRAL_AGENCIES :string = 'SEARCH_REFERRAL_AGENCIES';
export const searchReferralAgencies :RequestSequence = newRequestSequence(SEARCH_REFERRAL_AGENCIES);

export const GET_GEO_OPTIONS :'GET_GEO_OPTIONS' = 'GET_GEO_OPTIONS';
export const getGeoOptions :RequestSequence = newRequestSequence(GET_GEO_OPTIONS);

export const GEOCODE_PLACE :'GEOCODE_PLACE' = 'GEOCODE_PLACE';
export const geocodePlace :RequestSequence = newRequestSequence(GEOCODE_PLACE);

export const SET_VALUE :'SET_VALUE' = 'SET_VALUE';
export const setValue :RequestSequence = newRequestSequence(SET_VALUE);

export const SET_VALUES :'SET_VALUES' = 'SET_VALUES';
export const setValues :RequestSequence = newRequestSequence(SET_VALUES);

export const SELECT_PROVIDER :'SELECT_PROVIDER' = 'SELECT_PROVIDER';
export const selectProvider :RequestSequence = newRequestSequence(SELECT_PROVIDER);

export const SELECT_REFERRAL_AGENCY :'SELECT_REFERRAL_AGENCY' = 'SELECT_REFERRAL_AGENCY';
export const selectReferralAgency :RequestSequence = newRequestSequence(SELECT_REFERRAL_AGENCY);

export const LOAD_CURRENT_POSITION :'LOAD_CURRENT_POSITION' = 'LOAD_CURRENT_POSITION';
export const loadCurrentPosition :RequestSequence = newRequestSequence(LOAD_CURRENT_POSITION);

export const SELECT_LOCATION_OPTION :'SELECT_LOCATION_OPTION' = 'SELECT_LOCATION_OPTION';
export const selectLocationOption = (value :any) => ({
  type: SELECT_LOCATION_OPTION,
  value
});
