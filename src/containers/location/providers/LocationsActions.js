/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const CLEAR_LB_LOCATIONS :'CLEAR_LB_LOCATIONS' = 'CLEAR_LB_LOCATIONS';
const clearLBLocationResults = () => ({
  type: CLEAR_LB_LOCATIONS
});

const SEARCH_LOCATIONS :string = 'SEARCH_LOCATIONS';
const searchLocations :RequestSequence = newRequestSequence(SEARCH_LOCATIONS);

const GET_GEO_OPTIONS :string = 'GET_STAY_AWAY_GEO_OPTIONS';
const getGeoOptions :RequestSequence = newRequestSequence(GET_GEO_OPTIONS);

const GET_LB_LOCATIONS_NEIGHBORS :string = 'GET_LB_LOCATIONS_NEIGHBORS';
const getLBLocationsNeighbors :RequestSequence = newRequestSequence(GET_LB_LOCATIONS_NEIGHBORS);

const GET_LB_STAY_AWAY_PEOPLE :string = 'GET_LB_STAY_AWAY_PEOPLE';
const getLBStayAwayPeople :RequestSequence = newRequestSequence(GET_LB_STAY_AWAY_PEOPLE);

export {
  CLEAR_LB_LOCATIONS,
  GET_GEO_OPTIONS,
  GET_LB_LOCATIONS_NEIGHBORS,
  GET_LB_STAY_AWAY_PEOPLE,
  SEARCH_LOCATIONS,
  clearLBLocationResults,
  getGeoOptions,
  getLBLocationsNeighbors,
  getLBStayAwayPeople,
  searchLocations,
};
