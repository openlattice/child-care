// @flow
import { List, Map, get } from 'immutable';
import { APP_TYPES_FQNS as APP } from '../../../../../shared/Consts';
import * as FQN from '../../../../../edm/DataModelFqns';


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

  const aliases = get(personData, FQN.PERSON_NICK_NAME_FQN) || List();

  const formData = Map().withMutations((mutable) => {});

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
