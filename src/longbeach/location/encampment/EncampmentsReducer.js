/*
 * @flow
 */

import { LOCATION_CHANGE } from 'connected-react-router';
import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  CLEAR_ENCAMPMENT_LOCATIONS,
  RESET_ENCAMPMENT,
  RESET_ENCAMPMENT_OCCUPANTS,
  addPersonToEncampment,
  getEncampmentOccupants,
  getEncampmentPeopleOptions,
  getGeoOptions,
  removePersonFromEncampment,
  searchEncampmentLocations,
  submitEncampment,
} from './EncampmentActions';

import { HOME_PATH } from '../../../core/router/Routes';

const INITIAL_OCCUPATION = Map({
  fetchState: RequestStates.STANDBY,
  submitState: RequestStates.STANDBY,
  deleteState: RequestStates.STANDBY,
  people: Map(),
  livesAt: List(),
});

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  submitState: RequestStates.STANDBY,
  updateState: RequestStates.STANDBY,
  hits: List(),
  totalHits: 0,
  options: {
    geo: {
      fetchState: RequestStates.STANDBY,
      data: List()
    },
    people: {
      fetchState: RequestStates.STANDBY,
      data: List()
    }
  },
  profilePictures: Map(),
  searchInputs: Map({
    address: '',
    currentLocation: false,
  }),
  encampments: Map(),
  encampmentLocations: Map(),
  occupation: INITIAL_OCCUPATION
});

const encampmentsReducer = (state :Map = INITIAL_STATE, action :Object) => {

  switch (action.type) {

    case searchEncampmentLocations.case(action.type): {
      return searchEncampmentLocations.reducer(state, action, {
        REQUEST: () => state
          .set('fetchState', RequestStates.PENDING)
          .set('searchInputs', action.value),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    case getGeoOptions.case(action.type): {
      return getGeoOptions.reducer(state, action, {
        REQUEST: () => state.setIn(['options', 'geo', 'fetchState'], RequestStates.PENDING),
        SUCCESS: () => state
          .setIn(['options', 'geo', 'fetchState'], RequestStates.SUCCESS)
          .setIn(['options', 'geo', 'data'], action.value),
        FAILURE: () => state.setIn(['options', 'geo', 'fetchState'], RequestStates.FAILURE),
      });
    }

    case getEncampmentPeopleOptions.case(action.type): {
      return getEncampmentPeopleOptions.reducer(state, action, {
        REQUEST: () => state.setIn(['options', 'people', 'fetchState'], RequestStates.PENDING),
        SUCCESS: () => state
          .setIn(['options', 'people', 'fetchState'], RequestStates.SUCCESS)
          .setIn(['options', 'people', 'data'], action.value),
        FAILURE: () => state.setIn(['options', 'people', 'fetchState'], RequestStates.FAILURE),
      });
    }

    case submitEncampment.case(action.type): {
      return submitEncampment.reducer(state, action, {
        REQUEST: () => state.set('submitState', RequestStates.PENDING),
        SUCCESS: () => state
          .set('submitState', RequestStates.SUCCESS)
          .mergeDeep(action.value),
        FAILURE: () => state.set('submitState', RequestStates.FAILURE),
      });
    }

    case addPersonToEncampment.case(action.type): {
      return addPersonToEncampment.reducer(state, action, {
        REQUEST: () => state.setIn(['occupation', 'submitState'], RequestStates.PENDING),
        SUCCESS: () => state
          .setIn(['occupation', 'submitState'], RequestStates.SUCCESS)
          .mergeDeepIn(['occupation'], action.value),
        FAILURE: () => state.setIn(['occupation', 'submitState'], RequestStates.FAILURE),
      });
    }

    case getEncampmentOccupants.case(action.type): {
      return getEncampmentOccupants.reducer(state, action, {
        REQUEST: () => state.setIn(['occupation', 'fetchState'], RequestStates.PENDING),
        SUCCESS: () => state
          .setIn(['occupation', 'fetchState'], RequestStates.SUCCESS)
          .mergeDeepIn(['occupation'], action.value),
        FAILURE: () => state.setIn(['occupation', 'fetchState'], RequestStates.FAILURE),
      });
    }

    case removePersonFromEncampment.case(action.type): {
      return removePersonFromEncampment.reducer(state, action, {
        REQUEST: () => {
          const livesAt = state
            .getIn(['occupation', 'livesAt'])
            .filter((id) => id !== action.value);
          return state
            .setIn(['occupation', 'deleteState'], RequestStates.PENDING)
            .setIn(['occupation', 'livesAt'], livesAt)
            .deleteIn(['occupation', 'people', action.value]);
        },
        SUCCESS: () => state
          .setIn(['occupation', 'deleteState'], RequestStates.SUCCESS),
        FAILURE: () => state.setIn(['occupation', 'deleteState'], RequestStates.FAILURE),
      });
    }

    case CLEAR_ENCAMPMENT_LOCATIONS: {
      return INITIAL_STATE;
    }

    case RESET_ENCAMPMENT: {
      return state.set('submitState', INITIAL_STATE.get('submitState'));
    }

    case RESET_ENCAMPMENT_OCCUPANTS: {
      return state.set('occupation', INITIAL_OCCUPATION);
    }

    case LOCATION_CHANGE: {
      const {
        payload: {
          action: routingAction,
          location: {
            pathname
          } = {}
        } = {}
      } = action;

      // clear search results when pushing directly to /home
      if (pathname.startsWith(HOME_PATH) && routingAction === 'PUSH') {
        return INITIAL_STATE;
      }
      return state;
    }

    default:
      return state;
  }

};

export default encampmentsReducer;
