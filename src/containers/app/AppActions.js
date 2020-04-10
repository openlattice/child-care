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

const SWITCH_LANGUAGE :'SWITCH_LANGUAGE' = 'SWITCH_LANGUAGE';
const switchLanguage :RequestSequence = newRequestSequence(SWITCH_LANGUAGE);

const RELOAD_TOKEN :'RELOAD_TOKEN' = 'RELOAD_TOKEN';
const reloadToken :RequestSequence = newRequestSequence(RELOAD_TOKEN);

export {
  INITIALIZE_APPLICATION,
  LOAD_APP,
  RELOAD_TOKEN,
  SWITCH_LANGUAGE,
  SWITCH_ORGANIZATION,
  initializeApplication,
  loadApp,
  reloadToken,
  switchLanguage,
  switchOrganization,
};
