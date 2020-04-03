// @flow
import { Map, setIn } from 'immutable';
import { DataProcessingUtils } from 'lattice-fabricate';
import { DateTime } from 'luxon';

import {
  COMPLETED_DT_FQN,
  DATE_TIME_FQN,
  DESCRIPTION_FQN,
  ENTRY_UPDATED_FQN,
  LOCATION_COORDINATES_FQN,
  NUMBER_OF_PEOPLE_FQN
} from '../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { getEntityKeyId, getFormDataFromEntity } from '../../../utils/DataUtils';
import { isValidUuid } from '../../../utils/Utils';

const { getPageSectionKey, getEntityAddressKey } = DataProcessingUtils;

const {
  ENCAMPMENT_FQN,
  ENCAMPMENT_LOCATION_FQN,
  LOCATED_AT_FQN,
  REPORTED_FQN,
  STAFF_FQN,
} = APP_TYPES_FQNS;

const constructEntityIndexToIdMap = (
  reportedEKID :UUID,
  staffEKID :UUID,
  encampmentEKID :UUID
) => {
  const entityIndexToIdMap = Map().withMutations((mutable) => {
    if (isValidUuid(staffEKID)) {
      mutable.setIn([STAFF_FQN.toString(), 0], staffEKID);
    }
    if (isValidUuid(reportedEKID)) {
      mutable.setIn([REPORTED_FQN.toString(), 0], reportedEKID);
    }
    if (isValidUuid(encampmentEKID)) {
      mutable.setIn([ENCAMPMENT_FQN.toString(), 0], encampmentEKID);
    }
  });

  return entityIndexToIdMap;
};

const constructFormData = ({
  encampment,
  encampmentLocation,
} :any) => {

  const encampmentFormData = getFormDataFromEntity(
    encampment,
    ENCAMPMENT_FQN,
    [
      NUMBER_OF_PEOPLE_FQN,
      DESCRIPTION_FQN,
    ],
    0
  );

  const encampmentLocationFormData = getFormDataFromEntity(
    encampmentLocation,
    ENCAMPMENT_LOCATION_FQN,
    [LOCATION_COORDINATES_FQN],
    0
  );

  return Map().withMutations((mutable) => {
    const page = getPageSectionKey(1, 1);
    if (!encampmentFormData.isEmpty()) mutable.mergeIn([page], encampmentFormData);
    if (!encampmentLocationFormData.isEmpty()) mutable.mergeIn([page], encampmentLocationFormData);
  });
};

const getEncampmentAssociations = (formData :any, currentUser :Map, timestamp :DateTime) => {

  const nowAsIsoString = timestamp.isValid ? timestamp.toISO() : DateTime.local().toISO();
  const currentUserEKID = getEntityKeyId(currentUser);

  const associations = [
    // encampment -> located at -> location
    [LOCATED_AT_FQN, 0, ENCAMPMENT_FQN, 0, ENCAMPMENT_LOCATION_FQN, {
      [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
    }],
    // staff -> reported -> encampment
    [REPORTED_FQN, currentUserEKID, STAFF_FQN, 0, ENCAMPMENT_FQN, {
      [DATE_TIME_FQN.toString()]: [nowAsIsoString]
    }]
  ];

  return associations;
};

const addEncampmentTimestamps = (formData :any, timestamp :DateTime, isUpdate :boolean = false) => {
  const nowAsIsoString = timestamp.isValid ? timestamp.toISO() : DateTime.local().toISO();

  const withUpdatedOnly = setIn(
    formData,
    [getPageSectionKey(1, 1), getEntityAddressKey(0, ENCAMPMENT_FQN, ENTRY_UPDATED_FQN)],
    nowAsIsoString
  );

  const withTimestamps = setIn(
    withUpdatedOnly,
    [getPageSectionKey(1, 1), getEntityAddressKey(0, ENCAMPMENT_FQN, COMPLETED_DT_FQN)],
    nowAsIsoString
  );

  return isUpdate ? withUpdatedOnly : withTimestamps;
};

export {
  addEncampmentTimestamps,
  constructEntityIndexToIdMap,
  constructFormData,
  getEncampmentAssociations,
};
