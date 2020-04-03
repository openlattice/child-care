// @flow
import {
  List,
  Map,
  get,
  merge,
  remove
} from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';

import * as FQN from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { getFormDataFromEntity, getFormDataFromEntityArray } from '../../../../utils/DataUtils';

const { OPENLATTICE_ID_FQN } = Constants;

const {
  CONTACTED_VIA_FQN,
  CONTACT_INFORMATION_FQN,
  EMERGENCY_CONTACT_FQN,
  IS_EMERGENCY_CONTACT_FOR_FQN,
  PEOPLE_FQN,
} = APP_TYPES_FQNS;

const {
  getEntityAddressKey,
  getPageSectionKey,
} = DataProcessingUtils;

const getContactAssociations = (
  formData :Object,
  nowAsIsoString :String,
  personEKID :UUID | number
) => {
  const contacts = get(formData, getPageSectionKey(1, 1), []);
  const associations :any[][] = [];
  contacts.forEach((contact, index) => {
    const relationship = get(contact, getEntityAddressKey(-1, IS_EMERGENCY_CONTACT_FOR_FQN, FQN.RELATIONSHIP_FQN), '');
    associations.push(
      [IS_EMERGENCY_CONTACT_FOR_FQN, index, EMERGENCY_CONTACT_FQN, personEKID, PEOPLE_FQN, {
        [FQN.RELATIONSHIP_FQN]: [relationship]
      }],
      [CONTACTED_VIA_FQN, index, EMERGENCY_CONTACT_FQN, index, CONTACT_INFORMATION_FQN, {
        [FQN.COMPLETED_DT_FQN]: [nowAsIsoString]
      }]
    );
  });

  return associations;
};

// remove relationship data prevent it from being added as a regular entity on top of being an association
const removeRelationshipData = (formData :Object) :Object => {
  const contacts = get(formData, getPageSectionKey(1, 1), []);
  const withoutRelationships = contacts
    .map((contact :Object) => (
      remove(contact, getEntityAddressKey(-1, IS_EMERGENCY_CONTACT_FOR_FQN, FQN.RELATIONSHIP_FQN))
    ));

  return {
    [getPageSectionKey(1, 1)]: withoutRelationships
  };
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

const constructFormData = (contacts :List<Map>, isContactForList :List<Map>, contactInfoByContactEKID :Map) => {
  const contactProperties = List([
    FQN.PERSON_FIRST_NAME_FQN,
    FQN.PERSON_LAST_NAME_FQN,
  ]);

  const contactInfoProperties = List([
    FQN.CONTACT_PHONE_NUMBER_FQN,
    FQN.EXTENTION_FQN,
    FQN.TYPE_FQN,
    FQN.GENERAL_NOTES_FQN
  ]);

  const isContactForProperties = List([FQN.RELATIONSHIP_FQN]);

  const contactFormData = getFormDataFromEntityArray(
    contacts,
    EMERGENCY_CONTACT_FQN,
    contactProperties,
    -1
  );

  const isContactForFormData = getFormDataFromEntityArray(
    isContactForList,
    IS_EMERGENCY_CONTACT_FOR_FQN,
    isContactForProperties,
    -1
  );

  // the order of contactInfo is not guaranteed to be same as contacts. Must match them by EKID
  const contactInfoFormData = contacts.map((contact) => {
    const contactEKID = contact.getIn([OPENLATTICE_ID_FQN, 0]);
    const contactInfo = contactInfoByContactEKID.get(contactEKID);
    return getFormDataFromEntity(
      contactInfo,
      CONTACT_INFORMATION_FQN,
      contactInfoProperties,
      -1
    );
  });

  const mergedFormData = contactFormData
    .zipWith(merge, isContactForFormData)
    .zipWith(merge, contactInfoFormData);

  return Map().set(getPageSectionKey(1, 1), mergedFormData);

};

export {
  getContactAssociations,
  removeRelationshipData,
  constructEntityIndexToIdMap,
  constructFormData,
};
