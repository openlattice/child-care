// @flow
import { newRequestSequence } from 'redux-reqseq';

const GET_SCARS_MARKS_TATOOS :'GET_SCARS_MARKS_TATOOS' = 'GET_SCARS_MARKS_TATOOS';
const getScarsMarksTattoos = newRequestSequence(GET_SCARS_MARKS_TATOOS);

const SUBMIT_SCARS_MARKS_TATOOS :'SUBMIT_SCARS_MARKS_TATOOS' = 'SUBMIT_SCARS_MARKS_TATOOS';
const submitScarsMarksTattoos = newRequestSequence(SUBMIT_SCARS_MARKS_TATOOS);

const UPDATE_SCARS_MARKS_TATOOS :'UPDATE_SCARS_MARKS_TATOOS' = 'UPDATE_SCARS_MARKS_TATOOS';
const updateScarsMarksTattoos = newRequestSequence(UPDATE_SCARS_MARKS_TATOOS);

export {
  GET_SCARS_MARKS_TATOOS,
  SUBMIT_SCARS_MARKS_TATOOS,
  UPDATE_SCARS_MARKS_TATOOS,
  getScarsMarksTattoos,
  submitScarsMarksTattoos,
  updateScarsMarksTattoos,
};
