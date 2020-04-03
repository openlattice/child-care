// @flow
import { DataProcessingUtils } from 'lattice-fabricate';
import { Map, List } from 'immutable';
import { getFormDataFromEntityArray } from '../../../../../utils/DataUtils';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import * as FQN from '../../../../../edm/DataModelFqns';

const {
  OFFICER_SAFETY_CONCERNS_FQN,
  BEHAVIOR_FQN,
  INTERACTION_STRATEGY_FQN
} = APP_TYPES_FQNS;

const { getPageSectionKey } = DataProcessingUtils;

const constructFormData = (
  safetyConcerns :List<Map>,
  behaviors :List<Map>,
  strategies :List<Map>
) => {

  const safetyConcernsProperties = List([
    FQN.DESCRIPTION_FQN,
    FQN.CATEGORY_FQN
  ]);

  const behaviorProperties = List([FQN.TRIGGER_FQN]);
  const strategyProperties = List([FQN.TECHNIQUES_FQN]);

  const safetyConcernsFormData = getFormDataFromEntityArray(
    safetyConcerns,
    OFFICER_SAFETY_CONCERNS_FQN,
    safetyConcernsProperties,
    -1
  );

  const behaviorsFormData = getFormDataFromEntityArray(
    behaviors,
    BEHAVIOR_FQN,
    behaviorProperties,
    -1
  );

  const strategiesFormData = getFormDataFromEntityArray(
    strategies,
    INTERACTION_STRATEGY_FQN,
    strategyProperties,
    -1
  );

  return Map().withMutations((mutable) => {
    mutable.set(getPageSectionKey(1, 1), safetyConcernsFormData);
    mutable.set(getPageSectionKey(1, 2), behaviorsFormData);
    mutable.set(getPageSectionKey(1, 3), strategiesFormData);
  });

};

const constructEntityIndexToIdMap = (
  safetyConcernsEKIDs :List<UUID>,
  behaviorEKIDs :List<UUID>,
  strategyEKIDs :List<UUID>,
) => {
  const entityIndexToIdMap = Map().withMutations((mutable) => {
    mutable.setIn([OFFICER_SAFETY_CONCERNS_FQN.toString(), -1], safetyConcernsEKIDs);
    mutable.setIn([BEHAVIOR_FQN.toString(), -1], behaviorEKIDs);
    mutable.setIn([INTERACTION_STRATEGY_FQN.toString(), -1], strategyEKIDs);
  });

  return entityIndexToIdMap;
};

export {
  constructEntityIndexToIdMap,
  constructFormData,
};
