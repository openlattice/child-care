/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const LOAD_APP :'LOAD_APP' = 'LOAD_APP';
const loadApp :RequestSequence = newRequestSequence(LOAD_APP);

const SWITCH_ORGANIZATION :'SWITCH_ORGANIZATION' = 'SWITCH_ORGANIZATION';
const switchOrganization :RequestSequence = newRequestSequence(SWITCH_ORGANIZATION);

const INITIALIZE_APPLICATION :'INITIALIZE_APPLICATION' = 'INITIALIZE_APPLICATION';
const initializeApplication :RequestSequence = newRequestSequence(INITIALIZE_APPLICATION);

export {
  INITIALIZE_APPLICATION,
  LOAD_APP,
  SWITCH_ORGANIZATION,
  initializeApplication,
  loadApp,
  switchOrganization,
};
