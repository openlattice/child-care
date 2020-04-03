// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_ALL_ISSUES :'GET_ALL_ISSUES' = 'GET_ALL_ISSUES';
const getAllIssues :RequestSequence = newRequestSequence(GET_ALL_ISSUES);

const GET_MY_OPEN_ISSUES :'GET_MY_OPEN_ISSUES' = 'GET_MY_OPEN_ISSUES';
const getMyOpenIssues :RequestSequence = newRequestSequence(GET_MY_OPEN_ISSUES);

const GET_REPORTED_BY_ME :'GET_REPORTED_BY_ME' = 'GET_REPORTED_BY_ME';
const getReportedByMe :RequestSequence = newRequestSequence(GET_REPORTED_BY_ME);

const CLEAR_ISSUES :'CLEAR_ISSUES' = 'CLEAR_ISSUES';
const clearIssues = () => ({
  type: CLEAR_ISSUES
});

export {
  CLEAR_ISSUES,
  GET_ALL_ISSUES,
  GET_MY_OPEN_ISSUES,
  GET_REPORTED_BY_ME,
  clearIssues,
  getAllIssues,
  getMyOpenIssues,
  getReportedByMe,
};
