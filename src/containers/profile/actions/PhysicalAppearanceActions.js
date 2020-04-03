// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const GET_PHYSICAL_APPEARANCE :'GET_PHYSICAL_APPEARANCE' = 'GET_PHYSICAL_APPEARANCE';
const getPhysicalAppearance :RequestSequence = newRequestSequence(GET_PHYSICAL_APPEARANCE);

const CREATE_PHYSICAL_APPEARANCE :'CREATE_PHYSICAL_APPEARANCE' = 'CREATE_PHYSICAL_APPEARANCE';
const createPhysicalAppearance :RequestSequence = newRequestSequence(CREATE_PHYSICAL_APPEARANCE);

const UPDATE_PHYSICAL_APPEARANCE :'UPDATE_PHYSICAL_APPEARANCE' = 'UPDATE_PHYSICAL_APPEARANCE';
const updatePhysicalAppearance :RequestSequence = newRequestSequence(UPDATE_PHYSICAL_APPEARANCE);


export {
  CREATE_PHYSICAL_APPEARANCE,
  GET_PHYSICAL_APPEARANCE,
  UPDATE_PHYSICAL_APPEARANCE,
  createPhysicalAppearance,
  getPhysicalAppearance,
  updatePhysicalAppearance,
};
