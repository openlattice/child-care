/*
 * @flow
 */

import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import { LOCATION_CHANGE } from 'connected-react-router';
import type { DispatchAPI, MiddlewareAPI } from 'redux';

import {
  GET_GEO_OPTIONS,
  SEARCH_LOCATIONS,
  SEARCH_REFERRAL_AGENCIES,
  SELECT_PROVIDER,
  SELECT_REFERRAL_AGENCY
} from '../../containers/location/LocationsActions';

type TrackingAction = {
  +type :string;
  tracking ?:Object;
};

type Action =
  | TrackingAction;

const matchTrackingAction = (action :TrackingAction) => (
  (isPlainObject(action.tracking) && !isEmpty(action.tracking))
  || (action.type === GET_GEO_OPTIONS)
  || (action.type === LOCATION_CHANGE)
  || (action.type === SEARCH_LOCATIONS)
  || (action.type === SEARCH_REFERRAL_AGENCIES)
  || (action.type === SELECT_PROVIDER)
  || (action.type === SELECT_REFERRAL_AGENCY)
);

export default (handlers :Object) => (
  (store :MiddlewareAPI<*, Action, *>) => (
    (next :DispatchAPI<Action>) => (
      (action :Action) => {
        const prevState = store.getState();
        const result = next(action);
        const nextState = store.getState();
        const isMatch = matchTrackingAction(action);
        if (isMatch === true && isPlainObject(handlers) && !isEmpty(handlers)) {
          const handler = handlers[action.type];
          if (isFunction(handler)) {
            handler(action, prevState, nextState);
          }
        }
        return result;
      }
    )
  )
);
