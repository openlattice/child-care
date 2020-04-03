// @flow
import { DataProcessingUtils } from 'lattice-fabricate';
import { Map } from 'immutable';
import { getFormDataFromEntity } from '../../../../../../utils/DataUtils';
import { APP_TYPES_FQNS } from '../../../../../../shared/Consts';
import * as FQN from '../../../../../../edm/DataModelFqns';
import { isValidUuid } from '../../../../../../utils/Utils';

const { PHYSICAL_APPEARANCE_FQN } = APP_TYPES_FQNS;

const { getPageSectionKey } = DataProcessingUtils;

const constructFormData = (appearance :Map) => {

  const appearanceProperties = [
    FQN.EYE_COLOR_FQN,
    FQN.HAIR_COLOR_FQN,
    FQN.HEIGHT_FQN,
    FQN.WEIGHT_FQN,
  ];

  const appearanceFormData = getFormDataFromEntity(
    appearance,
    PHYSICAL_APPEARANCE_FQN,
    appearanceProperties,
    0
  );

  return Map().withMutations((mutable) => {
    if (!appearanceFormData.isEmpty()) mutable.mergeIn([getPageSectionKey(1, 1)], appearanceFormData);
  });

};

const constructEntityIndexToIdMap = (appearanceEKID :UUID) => {
  const entityIndexToIdMap = Map().withMutations((mutable) => {
    if (isValidUuid(appearanceEKID)) {
      mutable.setIn([PHYSICAL_APPEARANCE_FQN.toString(), 0], appearanceEKID);
    }
  });

  return entityIndexToIdMap;
};

export {
  constructFormData,
  constructEntityIndexToIdMap,
};
