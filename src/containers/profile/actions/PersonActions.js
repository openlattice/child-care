// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_PERSON_DATA :'GET_PERSON_DATA' = 'GET_PERSON_DATA';
const getPersonData :RequestSequence = newRequestSequence(GET_PERSON_DATA);

const SELECT_PERSON :'SELECT_PERSON' = 'SELECT_PERSON';
const selectPerson :RequestSequence = newRequestSequence(SELECT_PERSON);

export {
  GET_PERSON_DATA,
  SELECT_PERSON,
  getPersonData,
  selectPerson,
};
