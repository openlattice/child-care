/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const CLEAR_LB_PEOPLE :'CLEAR_LB_PEOPLE' = 'CLEAR_LB_PEOPLE';
const clearLBPeopleResults = () => ({
  type: CLEAR_LB_PEOPLE
});

const SEARCH_LB_PEOPLE :string = 'SEARCH_LB_PEOPLE';
const searchLBPeople :RequestSequence = newRequestSequence(SEARCH_LB_PEOPLE);

const GET_LB_PEOPLE_PHOTOS :string = 'GET_LB_PEOPLE_PHOTOS';
const getLBPeoplePhotos :RequestSequence = newRequestSequence(GET_LB_PEOPLE_PHOTOS);

const GET_LB_PEOPLE_STAY_AWAY :string = 'GET_LB_PEOPLE_STAY_AWAY';
const getLBPeopleStayAway :RequestSequence = newRequestSequence(GET_LB_PEOPLE_STAY_AWAY);

const GET_LB_STAY_AWAY_LOCATIONS :string = 'GET_LB_STAY_AWAY_LOCATIONS';
const getLBStayAwayLocations :RequestSequence = newRequestSequence(GET_LB_STAY_AWAY_LOCATIONS);

export {
  CLEAR_LB_PEOPLE,
  GET_LB_PEOPLE_PHOTOS,
  GET_LB_PEOPLE_STAY_AWAY,
  GET_LB_STAY_AWAY_LOCATIONS,
  SEARCH_LB_PEOPLE,
  clearLBPeopleResults,
  getLBPeoplePhotos,
  getLBPeopleStayAway,
  getLBStayAwayLocations,
  searchLBPeople,
};
