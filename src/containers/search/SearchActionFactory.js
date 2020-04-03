/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

/*
 * RequestSequences
 */

const SEARCH_CONSUMERS :'SEARCH_CONSUMERS' = 'SEARCH_CONSUMERS';
const searchConsumers :RequestSequence = newRequestSequence(SEARCH_CONSUMERS);

/*
 * standard actions
 */

const CLEAR_CONSUMER_SEARCH_RESULTS :'CLEAR_CONSUMER_SEARCH_RESULTS' = 'CLEAR_CONSUMER_SEARCH_RESULTS';

function clearConsumerSearchResults() :Object {

  return {
    type: CLEAR_CONSUMER_SEARCH_RESULTS
  };
}

export {
  CLEAR_CONSUMER_SEARCH_RESULTS,
  SEARCH_CONSUMERS,
  clearConsumerSearchResults,
  searchConsumers,
};
