// @flow
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import {
  List,
  Map,
  getIn,
  setIn
} from 'immutable';

import { getFormDataFromEntity } from '../../../../utils/DataUtils';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import {
  COMPLETED_DT_FQN,
  DATE_TIME_FQN,
  NOTES_FQN,
  PERSON_ID_FQN,
} from '../../../../edm/DataModelFqns';
import { isValidUuid } from '../../../../utils/Utils';

const {
  ASSIGNED_TO_FQN,
  RESPONSE_PLAN_FQN,
  PEOPLE_FQN,
  STAFF_FQN,
  SUBJECT_OF_FQN
} = APP_TYPES_FQNS;
const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { OPENLATTICE_ID_FQN } = Constants;

const getOptionsFromEntityList = (entities :List<Map>, property :string) => {

  const values = [];
  const labels = [];
  entities.forEach((entity :Map) => {
    const label = entity.getIn([property, 0]) || '';
    const value = entity.getIn([OPENLATTICE_ID_FQN, 0]);

    labels.push(label);
    values.push(value);
  });

  return [values, labels];
};

const constructFormData = (responsePlan :Map, responsibleUser :Map) => {
  const responsePlanFormData = getFormDataFromEntity(
    responsePlan,
    RESPONSE_PLAN_FQN,
    [NOTES_FQN],
    0
  );

  const responsibleUserFormData = getFormDataFromEntity(
    responsibleUser,
    STAFF_FQN,
    [OPENLATTICE_ID_FQN],
    0
  );

  return Map().withMutations((mutable) => {
    const page = getPageSectionKey(1, 1);
    if (!responsePlanFormData.isEmpty()) mutable.mergeIn([page], responsePlanFormData);
    if (!responsibleUserFormData.isEmpty()) mutable.mergeIn([page], responsibleUserFormData);
  });
};

const constructEntityIndexToIdMap = (
  responsePlanEKID :UUID,
  assignedToEKID :UUID
) => {
  const entityIndexToIdMap = Map().withMutations((mutable) => {
    if (isValidUuid(responsePlanEKID)) {
      mutable.setIn([RESPONSE_PLAN_FQN.toString(), 0], responsePlanEKID);
    }
    if (isValidUuid(assignedToEKID)) {
      mutable.setIn([ASSIGNED_TO_FQN.toString(), 0], assignedToEKID);
    }
  });

  return entityIndexToIdMap;
};

const getAboutPlanAssociations = (formData :any, personEKID :UUID, nowAsIsoString :string) => {
  const selectedUserEKID = getIn(
    formData,
    [getPageSectionKey(1, 1), getEntityAddressKey(0, STAFF_FQN, OPENLATTICE_ID_FQN)]
  );

  const associations = [
    // people -> assigned to -> staff (existing)
    [ASSIGNED_TO_FQN, personEKID, PEOPLE_FQN, selectedUserEKID, STAFF_FQN, {
      [DATE_TIME_FQN.toString()]: [nowAsIsoString]
    }],
    // person -> subject of -> reponse plan (new)
    [SUBJECT_OF_FQN, personEKID, PEOPLE_FQN, 0, RESPONSE_PLAN_FQN, {
      [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
    }]
  ];

  return associations;
};

const hydrateSchemaWithStaff = (schema :Object, responsibleUsers :List<Map>) => {
  const [values, labels] = getOptionsFromEntityList(responsibleUsers, PERSON_ID_FQN.toString());
  let newSchema = setIn(
    schema,
    [
      'properties',
      getPageSectionKey(1, 1),
      'properties',
      getEntityAddressKey(0, STAFF_FQN, OPENLATTICE_ID_FQN),
      'enum'
    ],
    values
  );
  newSchema = setIn(
    newSchema,
    [
      'properties',
      getPageSectionKey(1, 1),
      'properties',
      getEntityAddressKey(0, STAFF_FQN, OPENLATTICE_ID_FQN),
      'enumNames'
    ],
    labels
  );

  return newSchema;
};

export {
  constructEntityIndexToIdMap,
  constructFormData,
  getOptionsFromEntityList,
  getAboutPlanAssociations,
  hydrateSchemaWithStaff,
};
