/*
 * @flow
 */

import { LOCATION_CHANGE } from 'connected-react-router';
import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  CLEAR_LB_LOCATIONS,
  SELECT_PROVIDER,
  SET_VALUE,
  SET_VALUES,
  getGeoOptions,
  searchLocations
} from './LocationsActions';

import { PROVIDERS } from '../../../utils/constants/StateConstants';

import { HOME_PATH } from '../../../core/router/Routes';


const {
  SELECTED_PROVIDER,
  IS_EDITING_FILTERS,
  FILTER_PAGE,
  TYPE_OF_CARE,
  ZIP,
  RADIUS,
  CHILDREN,
  DAYS,
  TIMES
} = PROVIDERS;

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
  providerLocations: Map(),

  [SELECTED_PROVIDER]: null,
  [IS_EDITING_FILTERS]: false,
  [FILTER_PAGE]: null,
  [TYPE_OF_CARE]: [],
  [ZIP]: ['', {}],
  [RADIUS]: 10,
  [CHILDREN]: {},
  [DAYS]: {}
});

const locationsReducer = (state :Map = INITIAL_STATE, action :Object) => {

  switch (action.type) {

    case searchLocations.case(action.type): {
      return searchLocations.reducer(state, action, {
        REQUEST: () => state
          .set('fetchState', RequestStates.PENDING)
          .set('searchInputs', action.value)
          .merge(action.value),
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

    case SET_VALUE: {
      const { field, value } = action.value;
      return state.set(field, value);
    }

    case SELECT_PROVIDER: {
      return state.set(SELECTED_PROVIDER, action.value);
    }

    case SET_VALUES: {
      const map = action.value;
      return state.merge(map);
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

export default locationsReducer;
