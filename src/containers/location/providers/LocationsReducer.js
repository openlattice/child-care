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
  RRS_BY_ID,
  HOSPITALS_BY_ID,
  SELECTED_PROVIDER,
  IS_EXECUTING_SEARCH,
  IS_EDITING_FILTERS,
  HAS_PERFORMED_INITIAL_SEARCH,
  FILTER_PAGE,
  ACTIVE_ONLY,
  TYPE_OF_CARE,
  ZIP,
  RADIUS,
  CHILDREN,
  DAYS
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

  [HAS_PERFORMED_INITIAL_SEARCH]: false,
  [IS_EXECUTING_SEARCH]: false,
  [RRS_BY_ID]: Map(),
  [HOSPITALS_BY_ID]: Map(),
  [SELECTED_PROVIDER]: null,
  [IS_EDITING_FILTERS]: false,
  [ACTIVE_ONLY]: true,
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
          .set(IS_EXECUTING_SEARCH, true)
          .set(IS_EDITING_FILTERS, false)
          .set(FILTER_PAGE, null)
          .set(SELECTED_PROVIDER, null)
          .set(HAS_PERFORMED_INITIAL_SEARCH, true)
          .merge(action.value),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value.newData),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
        FINALLY: () => state.set(IS_EXECUTING_SEARCH, false)
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
