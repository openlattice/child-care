/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const CLEAR_SEARCH_RESULTS :'CLEAR_SEARCH_RESULTS' = 'CLEAR_SEARCH_RESULTS';
const clearSearchResults = () => ({
  type: CLEAR_SEARCH_RESULTS
});

const SEARCH_PEOPLE :string = 'SEARCH_PEOPLE';
const searchPeople :RequestSequence = newRequestSequence(SEARCH_PEOPLE);

const GET_PEOPLE_PHOTOS :string = 'GET_PEOPLE_PHOTOS';
const getPeoplePhotos :RequestSequence = newRequestSequence(GET_PEOPLE_PHOTOS);

const GET_RECENT_INCIDENTS :string = 'GET_RECENT_INCIDENTS';
const getRecentIncidents :RequestSequence = newRequestSequence(GET_RECENT_INCIDENTS);

export {
  CLEAR_SEARCH_RESULTS,
  GET_PEOPLE_PHOTOS,
  GET_RECENT_INCIDENTS,
  SEARCH_PEOPLE,
  clearSearchResults,
  getPeoplePhotos,
  getRecentIncidents,
  searchPeople,
};
