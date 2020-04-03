/*
 * @flow
 */

import { LOCATION_CHANGE } from 'connected-react-router';
import { List, Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';

import {
  CLEAR_SEARCH_RESULTS,
  getPeoplePhotos,
  getRecentIncidents,
  searchPeople,
} from './PeopleActions';

import { HOME_PATH } from '../../core/router/Routes';

const INITIAL_STATE :Map = fromJS({
  fetchState: RequestStates.STANDBY,
  hits: List(),
  totalHits: 0,
  profilePicsByEKID: Map(),
  recentIncidentsByEKID: Map({
    data: Map(),
    fetchState: RequestStates.STANDBY,
  }),
  searchInputs: Map({
    dob: undefined,
    firstName: '',
    lastName: '',
  }),
});

export default function peopleReducer(state :Map = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case searchPeople.case(action.type): {
      return searchPeople.reducer(state, action, {
        REQUEST: () => state
          .set('fetchState', RequestStates.PENDING)
          .merge(action.value),
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .merge(action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE)
      });
    }

    case getPeoplePhotos.case(action.type): {
      return getPeoplePhotos.reducer(state, action, {
        SUCCESS: () => state
          .set('fetchState', RequestStates.SUCCESS)
          .set('profilePicsByEKID', action.value),
        FAILURE: () => state.set('fetchState', RequestStates.FAILURE),
      });
    }

    case getRecentIncidents.case(action.type): {
      return getRecentIncidents.reducer(state, action, {
        REQUEST: () => state
          .setIn(['recentIncidentsByEKID', 'fetchState'], RequestStates.PENDING),
        SUCCESS: () => state
          .setIn(['recentIncidentsByEKID', 'fetchState'], RequestStates.SUCCESS)
          .setIn(['recentIncidentsByEKID', 'data'], action.value),
        FAILURE: () => state
          .setIn(['recentIncidentsByEKID', 'fetchState'], RequestStates.FAILURE),
      });
    }

    case CLEAR_SEARCH_RESULTS: {
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

}
