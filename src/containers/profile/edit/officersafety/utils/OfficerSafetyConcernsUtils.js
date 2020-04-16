// @flow
import { Map, List } from 'immutable';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';

const {
  OFFICER_SAFETY_CONCERNS_FQN,
  BEHAVIOR_FQN,
  INTERACTION_STRATEGY_FQN
} = APP_TYPES_FQNS;

const constructFormData = () => {

  return Map();

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
