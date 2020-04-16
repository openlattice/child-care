// @flow

import { Map, fromJS } from 'immutable';
import type { SequenceAction } from 'redux-reqseq';

const INITIAL_STATE :Map = fromJS({
});

const reportsReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    default:
      return state;
  }
};

export default reportsReducer;
