// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_ISSUE_NEIGHBORS :'GET_ISSUE_NEIGHBORS' = 'GET_ISSUE_NEIGHBORS';
const getIssueNeighbors :RequestSequence = newRequestSequence(GET_ISSUE_NEIGHBORS);

const SUBMIT_ISSUE :'SUBMIT_ISSUE' = 'SUBMIT_ISSUE';
const submitIssue :RequestSequence = newRequestSequence(SUBMIT_ISSUE);

const SELECT_ISSUE :'SELECT_ISSUE' = 'SELECT_ISSUE';
const selectIssue :RequestSequence = newRequestSequence(SELECT_ISSUE);

const UPDATE_ISSUE :'UPDATE_ISSUE' = 'UPDATE_ISSUE';
const updateIssue :RequestSequence = newRequestSequence(UPDATE_ISSUE);

const SET_ISSUE_STATUS :'SET_ISSUE_STATUS' = 'SET_ISSUE_STATUS';
const setIssueStatus :RequestSequence = newRequestSequence(SET_ISSUE_STATUS);

const RESET_ISSUE :'RESET_ISSUE' = 'RESET_ISSUE';
const resetIssue = () => ({
  type: RESET_ISSUE
});

export {
  GET_ISSUE_NEIGHBORS,
  RESET_ISSUE,
  SELECT_ISSUE,
  SET_ISSUE_STATUS,
  SUBMIT_ISSUE,
  UPDATE_ISSUE,
  getIssueNeighbors,
  resetIssue,
  selectIssue,
  setIssueStatus,
  submitIssue,
  updateIssue,
};
