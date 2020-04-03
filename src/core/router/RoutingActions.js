/*
 * @flow
 */

import * as Routes from './Routes';

declare type RoutingAction = {
  type :string;
  path :string;
  state ? :any;
};

const GO_TO_ROOT :'GO_TO_ROOT' = 'GO_TO_ROOT';
function goToRoot() :RoutingAction {
  return {
    path: Routes.ROOT,
    type: GO_TO_ROOT,
  };
}

const GO_TO_PATH :'GO_TO_PATH' = 'GO_TO_PATH';
function goToPath(path :string, state :any) :RoutingAction {
  return {
    path,
    state,
    type: GO_TO_PATH,
  };
}

const ROUTING_FAILURE :'ROUTING_FAILURE' = 'ROUTING_FAILURE';
function routingFailure(errorMessage :string, path :any) :Object {
  return {
    path,
    error: errorMessage,
    type: ROUTING_FAILURE,
  };
}

export {
  GO_TO_ROOT,
  GO_TO_PATH,
  ROUTING_FAILURE,
  goToRoot,
  goToPath,
  routingFailure,
};

export type {
  RoutingAction,
};
