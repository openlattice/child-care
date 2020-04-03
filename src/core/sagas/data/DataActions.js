// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const SUBMIT_DATA_GRAPH :'SUBMIT_DATA_GRAPH' = 'SUBMIT_DATA_GRAPH';
const submitDataGraph :RequestSequence = newRequestSequence(SUBMIT_DATA_GRAPH);

const SUBMIT_PARTIAL_REPLACE :'SUBMIT_PARTIAL_REPLACE' = 'SUBMIT_PARTIAL_REPLACE';
const submitPartialReplace :RequestSequence = newRequestSequence(SUBMIT_PARTIAL_REPLACE);

const DELETE_BULK_ENTITIES :'DELETE_BULK_ENTITIES' = 'DELETE_BULK_ENTITIES';
const deleteBulkEntities :RequestSequence = newRequestSequence(DELETE_BULK_ENTITIES);

const CREATE_OR_REPLACE_ASSOCIATION :'CREATE_OR_REPLACE_ASSOCIATION' = 'CREATE_OR_REPLACE_ASSOCIATION';
const createOrReplaceAssociation :RequestSequence = newRequestSequence(CREATE_OR_REPLACE_ASSOCIATION);

export {
  CREATE_OR_REPLACE_ASSOCIATION,
  DELETE_BULK_ENTITIES,
  SUBMIT_DATA_GRAPH,
  SUBMIT_PARTIAL_REPLACE,
  createOrReplaceAssociation,
  deleteBulkEntities,
  submitDataGraph,
  submitPartialReplace,
};
