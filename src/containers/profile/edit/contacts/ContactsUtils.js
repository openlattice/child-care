// @flow
import {
  List,
  Map,
} from 'immutable';

import { APP_TYPES_FQNS } from '../../../../shared/Consts';


const {
  CONTACT_INFORMATION_FQN,
  EMERGENCY_CONTACT_FQN,
  IS_EMERGENCY_CONTACT_FOR_FQN,
} = APP_TYPES_FQNS;

const getContactAssociations = (
  formData :Object,
  nowAsIsoString :String,
  personEKID :UUID | number
) => {

};

// remove relationship data prevent it from being added as a regular entity on top of being an association
const removeRelationshipData = (formData :Object) :Object => {
};

const constructEntityIndexToIdMap = (
  contactsEKIDs :List<UUID>,
  isContactForEKIDs :List<UUID>,
  contactInfoEKIDs :List<UUID>
) => {

  const addressToIdMap = Map().withMutations((mutable) => {
    mutable.setIn([EMERGENCY_CONTACT_FQN.toString(), -1], contactsEKIDs);
    mutable.setIn([IS_EMERGENCY_CONTACT_FOR_FQN.toString(), -1], isContactForEKIDs);
    mutable.setIn([CONTACT_INFORMATION_FQN.toString(), -1], contactInfoEKIDs);
  });

  return addressToIdMap;
};

const constructFormData = () => {

  return Map()

};

export {
  getContactAssociations,
  removeRelationshipData,
  constructEntityIndexToIdMap,
  constructFormData,
};
