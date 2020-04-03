// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const CLEAR_LB_PROFILE :'CLEAR_LB_PROFILE' = 'CLEAR_LB_PROFILE';
const clearLBProfile = () => ({
  type: CLEAR_LB_PROFILE
});

const GET_LB_PROFILE :string = 'GET_LB_PROFILE';
const getLBProfile :RequestSequence = newRequestSequence(GET_LB_PROFILE);

const SELECT_LB_PROFILE :string = 'SELECT_LB_PROFILE';
const selectLBProfile = (value :any) => ({
  type: SELECT_LB_PROFILE,
  value
});

const GET_LB_PROFILE_NEIGHBORS :'GET_LB_PROFILE_NEIGHBORS' = 'GET_LB_PROFILE_NEIGHBORS';
const getLBProfileNeighbors :RequestSequence = newRequestSequence(GET_LB_PROFILE_NEIGHBORS);

export {
  CLEAR_LB_PROFILE,
  GET_LB_PROFILE_NEIGHBORS,
  GET_LB_PROFILE,
  SELECT_LB_PROFILE,
  clearLBProfile,
  getLBProfileNeighbors,
  getLBProfile,
  selectLBProfile,
};
