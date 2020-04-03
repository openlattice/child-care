/*
 * @flow
 */

import { LOCATION_CHANGE } from 'connected-react-router';
import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  CLEAR_LB_LOCATIONS,
  getGeoOptions,
  searchLBLocations
} from './LongBeachLocationsActions';

import { HOME_PATH } from '../../../core/router/Routes';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  hits: List(),
  totalHits: 0,
  options: Map({
    fetchState: RequestStates.STANDBY,
    data: List()
  }),
  people: Map(),
  profilePictures: Map(),
  searchInputs: Map({
    address: '',
    currentLocation: false,
  }),
  stayAway: Map(),
  stayAwayLocations: Map(),
});

const longBeachLocationsReducer = (state :Map = INITIAL_STATE, action :Object) => {

  switch (action.type) {

    case searchLBLocations.case(action.type): {
      return searchLBLocations.reducer(state, action, {
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
        REQUEST: () => state.setIn(['options', 'fetchState'], RequestStates.PENDING),
        SUCCESS: () => state
          .setIn(['options', 'fetchState'], RequestStates.SUCCESS)
          .setIn(['options', 'data'], action.value),
        FAILURE: () => state.setIn(['options', 'fetchState'], RequestStates.FAILURE),
      });
    }

    case CLEAR_LB_LOCATIONS: {
      return INITIAL_STATE;
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

export default longBeachLocationsReducer;
