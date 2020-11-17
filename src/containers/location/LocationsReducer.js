/*
 * @flow
 */

import { LOCATION_CHANGE } from 'connected-react-router';
import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  SEARCH_LOCATIONS,
  GET_GEO_OPTIONS,
  GEOCODE_PLACE,
  LOAD_CURRENT_POSITION,
  SELECT_LOCATION_OPTION,
  SELECT_PROVIDER,
  SELECT_REFERRAL_AGENCY,
  SET_VALUE,
  SET_VALUES,
  geocodePlace,
  getGeoOptions,
  loadCurrentPosition,
  searchLocations
} from './LocationsActions';

import {
  HITS,
  PAGE,
  REQUEST_STATE,
  RS_INITIAL_STATE,
  TOTAL_HITS
} from '../../core/redux/constants';
import { HOME_PATH } from '../../core/router/Routes';
import { PROVIDERS } from '../../utils/constants/StateConstants';

declare var gtag :?Function;

const {
  ACTIVE_ONLY,
  CHILDREN,
  CURRENT_POSITION,
  DAYS,
  FILTER_PAGE,
  HOSPITALS_BY_ID,
  IS_EDITING_FILTERS,
  LAST_SEARCH_TYPE,
  PROVIDER_LOCATIONS,
  RADIUS,
  RRS_BY_ID,
  SEARCH_INPUTS,
  SELECTED_OPTION,
  SELECTED_PROVIDER,
  SELECTED_REFERRAL_AGENCY,
  TYPE_OF_CARE,
  ZIP,
} = PROVIDERS;

const INITIAL_STATE :Map = fromJS({
  [HITS]: List(),
  [TOTAL_HITS]: 0,
  options: Map({
    data: List()
  }),
  [SEARCH_INPUTS]: Map({
    address: '',
    currentLocation: false,
  }),
  [PROVIDER_LOCATIONS]: Map(),

  [GEOCODE_PLACE]: RS_INITIAL_STATE,
  [GET_GEO_OPTIONS]: RS_INITIAL_STATE,
  [LOAD_CURRENT_POSITION]: RS_INITIAL_STATE,
  [SEARCH_LOCATIONS]: RS_INITIAL_STATE,

  [ACTIVE_ONLY]: true,
  [CHILDREN]: {},
  [CURRENT_POSITION]: {},
  [DAYS]: {},
  [FILTER_PAGE]: null,
  [HOSPITALS_BY_ID]: Map(),
  [IS_EDITING_FILTERS]: false,
  [LAST_SEARCH_TYPE]: null,
  [PAGE]: 0,
  [RADIUS]: 10,
  [RRS_BY_ID]: Map(),
  [SELECTED_OPTION]: null,
  [SELECTED_PROVIDER]: null,
  [SELECTED_REFERRAL_AGENCY]: null,
  [TYPE_OF_CARE]: [],
  [ZIP]: ['', {}],
});

const locationsReducer = (state :Map = INITIAL_STATE, action :Object) => {

  switch (action.type) {

    case geocodePlace.case(action.type): {
      return geocodePlace.reducer(state, action, {
        REQUEST: () => state
          .setIn([GEOCODE_PLACE, REQUEST_STATE], RequestStates.PENDING)
          .setIn([GEOCODE_PLACE, action.id], action),
        SUCCESS: () => state
          .setIn([GEOCODE_PLACE, REQUEST_STATE], RequestStates.SUCCESS),
        FAILURE: () => state
          .setIn([GEOCODE_PLACE, REQUEST_STATE], RequestStates.FAILURE),
        FINALLY: () => state.deleteIn([GEOCODE_PLACE, action.id])
      });
    }

    case getGeoOptions.case(action.type): {
      return getGeoOptions.reducer(state, action, {
        REQUEST: () => state
          .setIn([GET_GEO_OPTIONS, REQUEST_STATE], RequestStates.PENDING)
          .setIn([GET_GEO_OPTIONS, action.id], action),
        SUCCESS: () => state
          .setIn([GET_GEO_OPTIONS, REQUEST_STATE], RequestStates.SUCCESS)
          .setIn(['options', 'data'], action.value),
        FAILURE: () => state
          .setIn([GET_GEO_OPTIONS, REQUEST_STATE], RequestStates.FAILURE),
        FINALLY: () => state.deleteIn([GET_GEO_OPTIONS, action.id])
      });
    }

    case loadCurrentPosition.case(action.type): {
      return loadCurrentPosition.reducer(state, action, {
        REQUEST: () => state
          .setIn([LOAD_CURRENT_POSITION, REQUEST_STATE], RequestStates.PENDING)
          .setIn([LOAD_CURRENT_POSITION, action.id], action),
        SUCCESS: () => state
          .setIn([LOAD_CURRENT_POSITION, REQUEST_STATE], RequestStates.SUCCESS)
          .set(CURRENT_POSITION, action.value),
        FAILURE: () => state
          .setIn([LOAD_CURRENT_POSITION, REQUEST_STATE], RequestStates.FAILURE),
        FINALLY: () => state.deleteIn([LOAD_CURRENT_POSITION, action.id])
      });
    }

    case searchLocations.case(action.type): {
      return searchLocations.reducer(state, action, {
        REQUEST: () => {
          const { searchInputs, page } = action.value;
          return state
            .setIn([SEARCH_LOCATIONS, REQUEST_STATE], RequestStates.PENDING)
            .setIn([SEARCH_LOCATIONS, action.id], action)
            .set(SEARCH_INPUTS, searchInputs)
            .set(PAGE, page)
            .set(IS_EDITING_FILTERS, false)
            .set(FILTER_PAGE, null)
            .set(SELECTED_PROVIDER, null)
            .set(SELECTED_REFERRAL_AGENCY, null)
            .merge(searchInputs);
        },
        SUCCESS: () => state
          .setIn([SEARCH_LOCATIONS, REQUEST_STATE], RequestStates.SUCCESS)
          .merge(action.value.newData),
        FAILURE: () => state.setIn([SEARCH_LOCATIONS, REQUEST_STATE], RequestStates.FAILURE),
        FINALLY: () => state.deleteIn([SEARCH_LOCATIONS, action.id])
      });
    }

    case SET_VALUE: {
      const { field, value } = action.value;
      return state.set(field, value);
    }

    case SELECT_LOCATION_OPTION: {
      if (!action.value) {
        return state
          .setIn([SELECTED_OPTION, 'label'], undefined)
          .setIn(['options', 'data'], List());
      }
      return state.set(SELECTED_OPTION, action.value);
    }

    case SELECT_PROVIDER: {
      return state.set(SELECTED_PROVIDER, action.value);
    }

    case SELECT_REFERRAL_AGENCY: {
      return state.set(SELECTED_REFERRAL_AGENCY, action.value);
    }

    case SET_VALUES: {
      const map = action.value;
      return state.merge(map);
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
