// @flow
import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import { DataProcessingUtils } from 'lattice-fabricate';
import type { SequenceAction } from 'redux-reqseq';

import {
  deleteOfficerSafetyConcerns,
  getOfficerSafety,
  getOfficerSafetyConcerns,
  submitOfficerSafetyConcerns,
  updateOfficerSafetyConcerns,
} from '../OfficerSafetyActions';

const { getPageSectionKey } = DataProcessingUtils;

const INITIAL_STATE :Map = fromJS({
  data: Map(),
  deleteState: RequestStates.STANDBY,
  entityIndexToIdMap: Map(),
  fetchState: RequestStates.STANDBY,
  formData: {
    [getPageSectionKey(1, 1)]: [],
    [getPageSectionKey(1, 2)]: [],
    [getPageSectionKey(1, 3)]: []
  },
  updateState: RequestStates.STANDBY,
});

const officerSafetyReducer = (state :Map = INITIAL_STATE, action :SequenceAction) => {
  switch (action.type) {

    case getOfficerSafety.case(action.type): {
      return getOfficerSafety.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state.set('fetchState', RequestStates.SUCCESS),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    case getOfficerSafetyConcerns.case(action.type): {
      return getOfficerSafetyConcerns.reducer(state, action, {
        REQUEST: () => state.set('fetchState', RequestStates.PENDING),
        SUCCESS: () => state
          .merge(action.value)
          .set('fetchState', RequestStates.SUCCESS),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    case submitOfficerSafetyConcerns.case(action.type): {
      return submitOfficerSafetyConcerns.reducer(state, action, {
        REQUEST: () => state.set('submitState', RequestStates.PENDING),
        SUCCESS: () => {
          const {
            entityIndexToIdMap,
            path,
            properties
          } = action.value;
          return state
            .set('entityIndexToIdMap', entityIndexToIdMap)
            .setIn(['formData', ...path], fromJS(properties))
            .set('submitState', RequestStates.SUCCESS);
        },
        FAILURE: () => state.set('submitState', RequestStates.FAILURE)
      });
    }

    case updateOfficerSafetyConcerns.case(action.type): {
      return updateOfficerSafetyConcerns.reducer(state, action, {
        REQUEST: () => {
          const { path, properties } = action.value;
          return state
            .set('updateState', RequestStates.PENDING)
            .setIn(['formData', ...path], fromJS(properties));
        },
        SUCCESS: () => state.set('updateState', RequestStates.SUCCESS),
        FAILURE: () => state.set('updateState', RequestStates.FAILURE)
      });
    }

    case deleteOfficerSafetyConcerns.case(action.type): {
      return deleteOfficerSafetyConcerns.reducer(state, action, {
        REQUEST: () => state.set('deleteState', RequestStates.PENDING),
        SUCCESS: () => {
          const { entityIndexToIdMap, path } = action.value;
          return state
            .set('deleteState', RequestStates.SUCCESS)
            .set('entityIndexToIdMap', entityIndexToIdMap)
            .deleteIn(['formData', ...path]);
        },
        FAILURE: () => state.set('deleteState', RequestStates.FAILURE)
      });
    }

    default:
      return state;
  }
};

export default officerSafetyReducer;
