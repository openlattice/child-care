/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const CLEAR_SUBJECT_INFORMATION :'CLEAR_SUBJECT_INFORMATION' = 'CLEAR_SUBJECT_INFORMATION';
const clearSubjectInformation = () => ({
  type: CLEAR_SUBJECT_INFORMATION
});

const SET_INPUT_VALUE :'SET_INPUT_VALUE_SUBJECT_INFORMATION' = 'SET_INPUT_VALUE_SUBJECT_INFORMATION';
const setInputValue :RequestSequence = newRequestSequence(SET_INPUT_VALUE);

const SET_INPUT_VALUES :'SET_INPUT_VALUES_SUBJECT_INFORMATION' = 'SET_INPUT_VALUES_SUBJECT_INFORMATION';
const setInputValues :RequestSequence = newRequestSequence(SET_INPUT_VALUES);

export {
  CLEAR_SUBJECT_INFORMATION,
  SET_INPUT_VALUE,
  SET_INPUT_VALUES,
  clearSubjectInformation,
  setInputValue,
  setInputValues
};
