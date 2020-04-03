/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const CLEAR_ENCAMPMENT_LOCATIONS :'CLEAR_ENCAMPMENT_LOCATIONS' = 'CLEAR_ENCAMPMENT_LOCATIONS';
const clearEncampmentLocationResults = () => ({
  type: CLEAR_ENCAMPMENT_LOCATIONS
});

const SEARCH_ENCAMPMENT_LOCATIONS :string = 'SEARCH_ENCAMPMENT_LOCATIONS';
const searchEncampmentLocations :RequestSequence = newRequestSequence(SEARCH_ENCAMPMENT_LOCATIONS);

const GET_GEO_OPTIONS :string = 'GET_ENCAMPMENT_GEO_OPTIONS';
const getGeoOptions :RequestSequence = newRequestSequence(GET_GEO_OPTIONS);

const GET_ENCAMPMENT_PEOPLE_OPTIONS :string = 'GET_ENCAMPMENT_PEOPLE_OPTIONS';
const getEncampmentPeopleOptions :RequestSequence = newRequestSequence(GET_ENCAMPMENT_PEOPLE_OPTIONS);

const GET_ENCAMPMENT_LOCATIONS_NEIGHBORS :string = 'GET_ENCAMPMENT_LOCATIONS_NEIGHBORS';
const getEncampmentLocationsNeighbors :RequestSequence = newRequestSequence(GET_ENCAMPMENT_LOCATIONS_NEIGHBORS);

const ADD_PERSON_TO_ENCAMPMENT :'ADD_PERSON_TO_ENCAMPMENT' = 'ADD_PERSON_TO_ENCAMPMENT';
const addPersonToEncampment :RequestSequence = newRequestSequence(ADD_PERSON_TO_ENCAMPMENT);

const GET_LB_STAY_AWAY_PEOPLE :string = 'GET_LB_STAY_AWAY_PEOPLE';
const getLBStayAwayPeople :RequestSequence = newRequestSequence(GET_LB_STAY_AWAY_PEOPLE);

const SUBMIT_ENCAMPMENT :'SUBMIT_ENCAMPMENT' = 'SUBMIT_ENCAMPMENT';
const submitEncampment :RequestSequence = newRequestSequence(SUBMIT_ENCAMPMENT);

const RESET_ENCAMPMENT :'RESET_ENCAMPMENT' = 'RESET_ENCAMPMENT';
const resetEncampment = () => ({
  type: RESET_ENCAMPMENT
});

const REMOVE_PERSON_FROM_ENCAMPMENT :'REMOVE_PERSON_FROM_ENCAMPMENT' = 'REMOVE_PERSON_FROM_ENCAMPMENT';
const removePersonFromEncampment :RequestSequence = newRequestSequence(REMOVE_PERSON_FROM_ENCAMPMENT);

const UPDATE_ENCAMPMENT :'UPDATE_ENCAMPMENT' = 'UPDATE_ENCAMPMENT';
const updateEncampment :RequestSequence = newRequestSequence(SUBMIT_ENCAMPMENT);

const GET_ENCAMPMENT_OCCUPANTS :'GET_ENCAMPMENT_OCCUPANTS' = 'GET_ENCAMPMENT_OCCUPANTS';
const getEncampmentOccupants :RequestSequence = newRequestSequence(GET_ENCAMPMENT_OCCUPANTS);

const RESET_ENCAMPMENT_OCCUPANTS :'RESET_ENCAMPMENT_OCCUPANTS' = 'RESET_ENCAMPMENT_OCCUPANTS';
const resetEncampmentOccupants = () => ({
  type: RESET_ENCAMPMENT_OCCUPANTS
});

export {
  ADD_PERSON_TO_ENCAMPMENT,
  CLEAR_ENCAMPMENT_LOCATIONS,
  GET_ENCAMPMENT_LOCATIONS_NEIGHBORS,
  GET_ENCAMPMENT_OCCUPANTS,
  GET_ENCAMPMENT_PEOPLE_OPTIONS,
  GET_GEO_OPTIONS,
  GET_LB_STAY_AWAY_PEOPLE,
  REMOVE_PERSON_FROM_ENCAMPMENT,
  RESET_ENCAMPMENT,
  RESET_ENCAMPMENT_OCCUPANTS,
  SEARCH_ENCAMPMENT_LOCATIONS,
  SUBMIT_ENCAMPMENT,
  UPDATE_ENCAMPMENT,
  addPersonToEncampment,
  clearEncampmentLocationResults,
  getEncampmentLocationsNeighbors,
  getEncampmentOccupants,
  getEncampmentPeopleOptions,
  getGeoOptions,
  getLBStayAwayPeople,
  removePersonFromEncampment,
  resetEncampment,
  resetEncampmentOccupants,
  searchEncampmentLocations,
  submitEncampment,
  updateEncampment,
};
