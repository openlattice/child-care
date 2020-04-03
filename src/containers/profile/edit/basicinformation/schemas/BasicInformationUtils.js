// @flow
import { List, Map, get } from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import { getFormDataFromEntity } from '../../../../../utils/DataUtils';
import { APP_TYPES_FQNS as APP } from '../../../../../shared/Consts';
import * as FQN from '../../../../../edm/DataModelFqns';

const { getPageSectionKey, getEntityAddressKey } = DataProcessingUtils;

const constructBasicFormData = (personData :Map, appearanceData :Map) => {
  const personProperties = [
    FQN.PERSON_DOB_FQN,
    FQN.PERSON_FIRST_NAME_FQN,
    FQN.PERSON_LAST_NAME_FQN,
    FQN.PERSON_MIDDLE_NAME_FQN,
    FQN.PERSON_NICK_NAME_FQN,
    FQN.PERSON_RACE_FQN,
    FQN.PERSON_SEX_FQN,
  ];

  const appearanceProperties = [
    FQN.EYE_COLOR_FQN,
    FQN.HAIR_COLOR_FQN,
    FQN.HEIGHT_FQN,
    FQN.WEIGHT_FQN,
  ];

  const personFormData = getFormDataFromEntity(personData, APP.PEOPLE_FQN, personProperties, 0);
  const appearanceFormData = getFormDataFromEntity(
    appearanceData,
    APP.PHYSICAL_APPEARANCE_FQN,
    appearanceProperties,
    0
  );

  const aliases = get(personData, FQN.PERSON_NICK_NAME_FQN) || List();

  const formData = Map().withMutations((mutable) => {
    if (!personFormData.isEmpty()) {
      mutable.set(getPageSectionKey(1, 1), personFormData);

      mutable.setIn([
        getPageSectionKey(1, 1),
        getEntityAddressKey(0, APP.PEOPLE_FQN, FQN.PERSON_NICK_NAME_FQN),
      ], aliases);
    }

    if (!appearanceFormData.isEmpty()) {
      mutable.set(getPageSectionKey(1, 2), appearanceFormData);
    }
  });

  return formData;
};

const constructBasicEntityIndexToIdMap = (personEKID :UUID, appearanceEKID :UUID) => {
  const addressToIdMap = Map().withMutations((mutable) => {
    if (personEKID) {
      mutable.setIn([APP.PEOPLE_FQN.toString(), 0], personEKID);
    }

    if (appearanceEKID) {
      mutable.setIn([APP.PHYSICAL_APPEARANCE_FQN, 0], appearanceEKID);
    }
  });

  return addressToIdMap;
};

export {
  constructBasicEntityIndexToIdMap,
  constructBasicFormData,
};
