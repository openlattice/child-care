// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const SUBMIT_ABOUT_PLAN :'SUBMIT_ABOUT_PLAN' = 'SUBMIT_ABOUT_PLAN';
const submitAboutPlan :RequestSequence = newRequestSequence(SUBMIT_ABOUT_PLAN);

const GET_RESPONSIBLE_USER :'GET_RESPONSIBLE_USER' = 'GET_RESPONSIBLE_USER';
const getResponsibleUser :RequestSequence = newRequestSequence(GET_RESPONSIBLE_USER);

const UPDATE_RESPONSIBLE_USER :'UPDATE_RESPONSIBLE_USER' = 'UPDATE_RESPONSIBLE_USER';
const updateResponsibleUser :RequestSequence = newRequestSequence(UPDATE_RESPONSIBLE_USER);

const GET_ABOUT_PLAN :'GET_ABOUT_PLAN' = 'GET_ABOUT_PLAN';
const getAboutPlan :RequestSequence = newRequestSequence(GET_ABOUT_PLAN);

const UPDATE_ABOUT_PLAN :'UPDATE_ABOUT_PLAN' = 'UPDATE_ABOUT_PLAN';
const updateAboutPlan :RequestSequence = newRequestSequence(UPDATE_ABOUT_PLAN);

export {
  GET_ABOUT_PLAN,
  GET_RESPONSIBLE_USER,
  SUBMIT_ABOUT_PLAN,
  UPDATE_ABOUT_PLAN,
  UPDATE_RESPONSIBLE_USER,
  getAboutPlan,
  getResponsibleUser,
  submitAboutPlan,
  updateAboutPlan,
  updateResponsibleUser,
};
