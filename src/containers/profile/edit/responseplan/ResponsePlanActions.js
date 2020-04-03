// @flow
import { newRequestSequence } from 'redux-reqseq';

const SUBMIT_RESPONSE_PLAN :'SUBMIT_RESPONSE_PLAN' = 'SUBMIT_RESPONSE_PLAN';
const submitResponsePlan = newRequestSequence(SUBMIT_RESPONSE_PLAN);

const GET_RESPONSE_PLAN :'GET_RESPONSE_PLAN' = 'GET_RESPONSE_PLAN';
const getResponsePlan = newRequestSequence(GET_RESPONSE_PLAN);

const UPDATE_RESPONSE_PLAN :'UPDATE_RESPONSE_PLAN' = 'UPDATE_RESPONSE_PLAN';
const updateResponsePlan = newRequestSequence(UPDATE_RESPONSE_PLAN);

const DELETE_INTERACTION_STRATEGIES :'DELETE_INTERACTION_STRATEGIES' = 'DELETE_INTERACTION_STRATEGIES';
const deleteInteractionStrategies = newRequestSequence(DELETE_INTERACTION_STRATEGIES);

export {
  DELETE_INTERACTION_STRATEGIES,
  GET_RESPONSE_PLAN,
  SUBMIT_RESPONSE_PLAN,
  UPDATE_RESPONSE_PLAN,
  deleteInteractionStrategies,
  getResponsePlan,
  submitResponsePlan,
  updateResponsePlan,
};
