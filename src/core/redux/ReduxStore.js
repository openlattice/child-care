/*
 * @flow
 */

import createSagaMiddleware from '@redux-saga/core';
import { routerMiddleware } from 'connected-react-router/immutable';
import { Map } from 'immutable';
import { EntityDataModelApiActions } from 'lattice-sagas';
import { applyMiddleware, compose, createStore } from 'redux';

import reduxReducer from './ReduxReducer';

import sagas from '../sagas/Sagas';
import trackingHandlers from '../tracking/google/trackinghandlers';
import trackingMiddleware from '../tracking/TrackingMiddleware';

const { getAllPropertyTypes, getEntityDataModelProjection } = EntityDataModelApiActions;

export default function initializeReduxStore(routerHistory :any) :Object {

  const sagaMiddleware = createSagaMiddleware();

  const reduxMiddlewares = [
    sagaMiddleware,
    routerMiddleware(routerHistory),
    trackingMiddleware(trackingHandlers),
  ];

  const reduxEnhancers = [
    applyMiddleware(...reduxMiddlewares)
  ];

  const actionSanitizer = (action :Object) :Object => {
    switch (action.type) {
      case getAllPropertyTypes.SUCCESS:
      case getEntityDataModelProjection.SUCCESS:
        return { ...action, value: 'SANITIZED: Remove actionSanitizer from enhancers to view.' };
      default:
        return action;
    }
  };

  const stateSanitizer = (state :Map) :Map => state
    .set('edm', 'SANITIZED: Remove stateSanitizer from enhancers to view.');

  /* eslint-disable no-underscore-dangle */
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      actionSanitizer,
      stateSanitizer,
      maxAge: 50,
      // serialize: true
    })
    : compose;
  /* eslint-enable */

  const reduxStore = createStore(
    reduxReducer(routerHistory),
    Map(),
    composeEnhancers(...reduxEnhancers)
  );

  sagaMiddleware.run(sagas);

  return reduxStore;
}
