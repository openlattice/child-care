// @flow
import { List, Map } from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';

import { APP_TYPES_FQNS as APP } from '../../../../shared/Consts';
import * as FQN from '../../../../edm/DataModelFqns';
import { getFormDataFromEntityArray } from '../../../../utils/DataUtils';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;

const constructResponsePlanFormData = (responsePlan :Map, interactionStrategies :List) => {
  const backgroundSummary = responsePlan.getIn([FQN.CONTEXT_FQN, 0], '');
  const strategyProperties = List([
    FQN.TITLE_FQN,
    FQN.DESCRIPTION_FQN,
  ]);

  const strategyFormData = getFormDataFromEntityArray(
    interactionStrategies,
    APP.INTERACTION_STRATEGY_FQN,
    strategyProperties,
    -1
  );

  const data = Map().withMutations((mutable) => {

    mutable.setIn([
      getPageSectionKey(1, 1),
      getEntityAddressKey(0, APP.RESPONSE_PLAN_FQN, FQN.CONTEXT_FQN)
    ],
    backgroundSummary);

    mutable.set(getPageSectionKey(1, 2), strategyFormData);
  });

  return data;
};

const constructEntityIndexToIdMap = (responsePlanEKID :UUID, interactionStrategiesEKIDs :UUID[]) => {

  const addressToIdMap = Map().withMutations((mutable) => {
    if (responsePlanEKID) {
      mutable.setIn([APP.RESPONSE_PLAN_FQN.toString(), 0], responsePlanEKID);
    }

    if (interactionStrategiesEKIDs) {
      mutable.setIn([APP.INTERACTION_STRATEGY_FQN.toString(), -1], interactionStrategiesEKIDs);
    }

  });

  return addressToIdMap;
};

export {
  constructEntityIndexToIdMap,
  constructResponsePlanFormData
};
