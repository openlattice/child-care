/*
 * @flow
 */

import { ReduxConstants } from 'lattice-utils';
import { RequestStates } from 'redux-reqseq';

export const {
  APP,
  ERROR,
  HITS,
  PAGE,
  REQUEST_STATE,
  TOTAL_HITS,
} = ReduxConstants;

export const RS_INITIAL_STATE = {
  [ERROR]: false,
  [REQUEST_STATE]: RequestStates.STANDBY,
};
