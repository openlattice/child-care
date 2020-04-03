/*
 * @flow
 */

import isEmpty from 'lodash/isEmpty';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import { LOCATION_CHANGE } from 'connected-react-router';
import type { DispatchAPI, MiddlewareAPI } from 'redux';

type TrackingAction = {
  +type :string;
  tracking ?:Object;
};

type Action =
  | TrackingAction;

const matchTrackingAction = (action :TrackingAction) => (
  (isPlainObject(action.tracking) && !isEmpty(action.tracking))
  || (action.type === LOCATION_CHANGE)
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
