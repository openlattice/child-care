// @flow
import { newRequestSequence } from 'redux-reqseq';

const GET_ADDRESS :'GET_ADDRESS' = 'GET_ADDRESS';
const getAddress = newRequestSequence(GET_ADDRESS);

const SUBMIT_ADDRESS :'SUBMIT_ADDRESS' = 'SUBMIT_ADDRESS';
const submitAddress = newRequestSequence(SUBMIT_ADDRESS);

const UPDATE_ADDRESS :'UPDATE_ADDRESS' = 'UPDATE_ADDRESS';
const updateAddress = newRequestSequence(UPDATE_ADDRESS);

export {
  GET_ADDRESS,
  SUBMIT_ADDRESS,
  UPDATE_ADDRESS,
  getAddress,
  submitAddress,
  updateAddress,
};
