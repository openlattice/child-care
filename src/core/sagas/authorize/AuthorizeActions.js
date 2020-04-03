// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_AUTHORIZATION :'GET_AUTHORIZATION' = 'GET_AUTHORIZATION';
const getAuthorization :RequestSequence = newRequestSequence(GET_AUTHORIZATION);

export {
  GET_AUTHORIZATION,
  getAuthorization,
};
