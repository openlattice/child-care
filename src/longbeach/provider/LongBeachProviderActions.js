// @flow
import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_LB_PROVIDERS :'GET_LB_PROVIDERS' = 'GET_LB_PROVIDERS';
const getLBProviders :RequestSequence = newRequestSequence(GET_LB_PROVIDERS);

export {
  GET_LB_PROVIDERS,
  getLBProviders,
};
