/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

export const SEARCH_LOCATIONS :string = 'SEARCH_LOCATIONS';
export const searchLocations :RequestSequence = newRequestSequence(SEARCH_LOCATIONS);

export const GET_GEO_OPTIONS :string = 'GET_STAY_AWAY_GEO_OPTIONS';
export const getGeoOptions :RequestSequence = newRequestSequence(GET_GEO_OPTIONS);

export const SET_VALUE :string = 'SET_VALUE';
export const setValue :RequestSequence = newRequestSequence(SET_VALUE);

export const SET_VALUES :string = 'SET_VALUES';
export const setValues :RequestSequence = newRequestSequence(SET_VALUES);

export const SELECT_PROVIDER :string = 'SELECT_PROVIDER';
export const selectProvider :RequestSequence = newRequestSequence(SELECT_PROVIDER);
