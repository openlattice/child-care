// @flow
import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';

import {
  getPhotos,
  updatePhoto,
  submitPhotos,
} from '../actions/PhotosActions';

const INITIAL_STATE :Map = fromJS({
  entityIndexToIdMap: Map(),
  fetchState: RequestStates.STANDBY,
  updateState: RequestStates.STANDBY,
});

const photosReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {

  switch (action.type) {

    case getPhotos.case(action.type): {
      return getPhotos.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .merge(action.value)
          .set('fetchState', RequestStates.SUCCESS),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    case submitPhotos.case(action.type): {
      return submitPhotos.reducer(state, action, {
        REQUEST: () => state.set('submitState', RequestStates.PENDING),
        SUCCESS: () => {
          const {
            entityIndexToIdMap,
          } = action.value;
          return state
            .set('entityIndexToIdMap', entityIndexToIdMap)
            .set('submitState', RequestStates.SUCCESS);
        },
        FAILURE: () => state.set('submitState', RequestStates.FAILURE)
      });
    }

    case updatePhoto.case(action.type): {
      return updatePhoto.reducer(state, action, {
        REQUEST: () => state.set('updateState', RequestStates.PENDING),
        SUCCESS: () => state.set('updateState', RequestStates.SUCCESS),
        FAILURE: () => state.set('updateState', RequestStates.FAILURE)
      });
    }

    default:
      return state;
  }
};

export default photosReducer;
