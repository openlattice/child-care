// @flow
import { Map, getIn, setIn } from 'immutable';
import { Constants } from 'lattice';
import { DateTime } from 'luxon';
import { DataProcessingUtils } from 'lattice-fabricate';
import type { Match } from 'react-router';

import { getFormDataFromEntity, getEntityKeyId } from '../../../utils/DataUtils';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import {
  CATEGORY_FQN,
  DATE_TIME_FQN,
  COMPLETED_DT_FQN,
  DESCRIPTION_FQN,
  PRIORITY_FQN,
  TITLE_FQN,
  STATUS_FQN,
  ENTRY_UPDATED_FQN,
} from '../../../edm/DataModelFqns';
import { isValidUuid } from '../../../utils/Utils';
import { CATEGORY_PATHS } from './constants';
import {
  ISSUES_PATH,
  ISSUE_ID_PARAM,
  ISSUE_PATH,
  PROFILE_ID_PATH,
} from '../../../core/router/Routes';

const { getPageSectionKey, getEntityAddressKey } = DataProcessingUtils;

const { OPENLATTICE_ID_FQN } = Constants;
const {
  STAFF_FQN,
  ISSUE_FQN,
  SUBJECT_OF_FQN,
  REPORTED_FQN,
  ASSIGNED_TO_FQN,
  PEOPLE_FQN,
} = APP_TYPES_FQNS;

const constructEntityIndexToIdMap = (
  assignedToEKID :UUID,
  assigneeEKID :UUID,
  issueEKID :UUID
) => {
  const entityIndexToIdMap = Map().withMutations((mutable) => {
    if (isValidUuid(assigneeEKID)) {
      mutable.setIn([STAFF_FQN.toString(), 0], assigneeEKID);
    }
    if (isValidUuid(assignedToEKID)) {
      mutable.setIn([ASSIGNED_TO_FQN.toString(), 0], assignedToEKID);
    }
    if (isValidUuid(issueEKID)) {
      mutable.setIn([ISSUE_FQN.toString(), 0], issueEKID);
    }
  });

  return entityIndexToIdMap;
};

const constructFormData = ({
  assignee,
  issue,
  defaultComponent
} :any) => {

  const responsibleUserFormData = getFormDataFromEntity(
    assignee,
    STAFF_FQN,
    [OPENLATTICE_ID_FQN],
    0
  );

  const issueFormData = getFormDataFromEntity(
    issue,
    ISSUE_FQN,
    [
      CATEGORY_FQN,
      DESCRIPTION_FQN,
      PRIORITY_FQN,
      TITLE_FQN,
      STATUS_FQN,
    ],
    0
  );

  const componentFormData = Map().withMutations((mutable) => {
    if (defaultComponent) {
      mutable.set(getEntityAddressKey(0, ISSUE_FQN, CATEGORY_FQN), defaultComponent);
    }
  });

  return Map().withMutations((mutable) => {
    const page = getPageSectionKey(1, 1);
    if (!responsibleUserFormData.isEmpty()) mutable.mergeIn([page], responsibleUserFormData);
    if (!componentFormData.isEmpty()) mutable.mergeIn([page], componentFormData);
    if (!issueFormData.isEmpty()) mutable.mergeIn([page], issueFormData);
  });
};

const getIssueAssociations = (formData :any, person :Map, currentUser :Map, timestamp :DateTime) => {

  const nowAsIsoString = timestamp.isValid ? timestamp.toISO() : DateTime.local().toISO();
  const personEKID = getEntityKeyId(person);
  const currentUserEKID = getEntityKeyId(currentUser);
  const assigneeEKID = getIn(
    formData,
    [getPageSectionKey(1, 1), getEntityAddressKey(0, STAFF_FQN, OPENLATTICE_ID_FQN)]
  );

  const associations = [
    // person -> subject of -> issue
    [SUBJECT_OF_FQN, personEKID, PEOPLE_FQN, 0, ISSUE_FQN, {
      [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
    }],
    // issue -> assigned to -> staff
    [ASSIGNED_TO_FQN, 0, ISSUE_FQN, assigneeEKID, STAFF_FQN, {
      [DATE_TIME_FQN.toString()]: [nowAsIsoString]
    }],
    // staff -> reported -> issue
    [REPORTED_FQN, currentUserEKID, STAFF_FQN, 0, ISSUE_FQN, {
      [DATE_TIME_FQN.toString()]: [nowAsIsoString]
    }]
  ];

  return associations;
};

const addIssueTimestamps = (formData :any, timestamp :DateTime, isUpdate :boolean = false) => {
  const nowAsIsoString = timestamp.isValid ? timestamp.toISO() : DateTime.local().toISO();

  const withUpdatedOnly = setIn(
    formData,
    [getPageSectionKey(1, 1), getEntityAddressKey(0, ISSUE_FQN, ENTRY_UPDATED_FQN)],
    nowAsIsoString
  );

  const withTimestamps = setIn(
    withUpdatedOnly,
    [getPageSectionKey(1, 1), getEntityAddressKey(0, ISSUE_FQN, COMPLETED_DT_FQN)],
    nowAsIsoString
  );

  return isUpdate ? withUpdatedOnly : withTimestamps;
};

const getJumpToActionPath = (
  person :Map,
  component :string,
  defaultPath :string = ISSUES_PATH
) => {
  const personEKID = getEntityKeyId(person);
  const rawPath = CATEGORY_PATHS[component];

  if (rawPath && personEKID) {
    return CATEGORY_PATHS[component].replace(PROFILE_ID_PATH, personEKID);
  }

  return defaultPath;
};

const getIssueUrl = (id :UUID, match :Match) => {
  const { location } = window;
  const appUrl = match.url;
  const baseUrl = location.href.split(appUrl)[0];
  return `${baseUrl}${ISSUE_PATH}`.replace(`:${ISSUE_ID_PARAM}`, id);
};

export {
  addIssueTimestamps,
  constructEntityIndexToIdMap,
  constructFormData,
  getIssueAssociations,
  getIssueUrl,
  getJumpToActionPath,
};
