/*
 * @flow
 */

import randomUUID from 'uuid/v4';
import { List, Map, fromJS } from 'immutable';
import { DateTime } from 'luxon';

import { SET_INPUT_VALUE, SET_INPUT_VALUES } from './ActionFactory';
import {
  ARRESTED,
  CRIMES_AGAINST_PERSON,
  DISPOSITIONS as DISPOSITION_TYPES,
  FELONY,
  NOT_ARRESTED,
  NO_ACTION_NECESSARY,
  RESOURCES_DECLINED,
  UNABLE_TO_CONTACT
} from './Constants';

import { DISPOSITION, OTHER, POST_PROCESS_FIELDS } from '../../../utils/constants/CrisisReportConstants';
import { FORM_STEP_STATUS } from '../../../utils/constants/FormConstants';

const {
  SPECIALISTS,
  DISPOSITIONS,
  INCIDENT_DATE_TIME,
  HAS_REPORT_NUMBER,
  REPORT_NUMBER,
  INCIDENT_DESCRIPTION,

  // for disposition field
  PEOPLE_NOTIFIED,
  OTHER_PEOPLE_NOTIFIED,
  VERBAL_REFERRALS,
  OTHER_VERBAL_REFERRAL,
  COURTESY_TRANSPORTS,
  HOSPITALS,
  WAS_VOLUNTARY_TRANSPORT,
  ARRESTABLE_OFFENSES,
  NO_ACTION_VALUES
} = DISPOSITION;

const INITIAL_STATE :Map<*, *> = fromJS({
  [SPECIALISTS]: [],
  [DISPOSITIONS]: [],
  [INCIDENT_DATE_TIME]: '',
  [HAS_REPORT_NUMBER]: undefined,
  [REPORT_NUMBER]: '',
  [INCIDENT_DESCRIPTION]: '',

  // for disposition field
  [PEOPLE_NOTIFIED]: [],
  [OTHER_PEOPLE_NOTIFIED]: '',
  [VERBAL_REFERRALS]: [],
  [OTHER_VERBAL_REFERRAL]: '',
  [COURTESY_TRANSPORTS]: [],
  [HOSPITALS]: [],
  [WAS_VOLUNTARY_TRANSPORT]: undefined,
  [ARRESTABLE_OFFENSES]: [],
  [NO_ACTION_VALUES]: []
});

export default function reportReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case SET_INPUT_VALUE: {
      const { field, value } = action.value;
      return state.set(field, value);
    }
    case SET_INPUT_VALUES:
      return state.merge(fromJS(action.value));

    default:
      return state;
  }
}

export function getInvalidFields(state :Map<*, *>) {
  const invalidFields = [];

  // DISPOSITION CHECKBOX LIST

  const dispositions = state.get(DISPOSITIONS);

  if (!dispositions.size) {
    invalidFields.push(DISPOSITIONS);
  }

  if (dispositions.includes(DISPOSITION_TYPES.NOTIFIED_SOMEONE)) {
    const peopleNotified = state.get(PEOPLE_NOTIFIED, List());
    if (!peopleNotified.size) {
      invalidFields.push(PEOPLE_NOTIFIED);
    }

    else if (peopleNotified.includes(OTHER) && !state.get(OTHER_PEOPLE_NOTIFIED, '').length) {
      invalidFields.push(PEOPLE_NOTIFIED);
    }
  }

  if (dispositions.includes(DISPOSITION_TYPES.VERBAL_REFERRAL)) {
    const verbalReferrals = state.get(VERBAL_REFERRALS, List());
    if (!verbalReferrals.size) {
      invalidFields.push(VERBAL_REFERRALS);
    }

    else if (verbalReferrals.includes(OTHER) && !state.get(OTHER_VERBAL_REFERRAL, '').length) {
      invalidFields.push(VERBAL_REFERRALS);
    }
  }

  if (dispositions.includes(DISPOSITION_TYPES.COURTESY_TRANPORT)) {
    if (!state.get(COURTESY_TRANSPORTS, List()).size) {
      invalidFields.push(COURTESY_TRANSPORTS);
    }
  }

  if (dispositions.includes(DISPOSITION_TYPES.HOSPITAL)) {
    if (state.get(WAS_VOLUNTARY_TRANSPORT) === undefined) {
      invalidFields.push(WAS_VOLUNTARY_TRANSPORT);
    }
  }

  if (dispositions.includes(DISPOSITION_TYPES.ARRESTABLE_OFFENSE)) {
    if (!state.get(ARRESTABLE_OFFENSES, List()).size) {
      invalidFields.push(ARRESTABLE_OFFENSES);
    }
  }

  if (dispositions.includes(DISPOSITION_TYPES.NO_ACTION_POSSIBLE)) {
    if (!state.get(NO_ACTION_VALUES, List()).size) {
      invalidFields.push(NO_ACTION_VALUES);
    }
  }

  // INCIDENT DATETIME / REPORT NUMBER / DESCRIPTION

  if (!DateTime.fromISO(state.get(INCIDENT_DATE_TIME)).isValid) {
    invalidFields.push(INCIDENT_DATE_TIME);
  }

  if (state.get(HAS_REPORT_NUMBER) !== undefined) {

    if (state.get(HAS_REPORT_NUMBER) && !state.get(REPORT_NUMBER, '').length) {
      invalidFields.push(REPORT_NUMBER);
    }
    else if (!state.get(HAS_REPORT_NUMBER) && !state.get(INCIDENT_DESCRIPTION, '').length) {
      invalidFields.push(INCIDENT_DESCRIPTION);
    }
  }
  else {
    invalidFields.push(HAS_REPORT_NUMBER);
  }

  return invalidFields;
}

export function getStatus(state :Map<*, *>) :string {
  if (state === INITIAL_STATE) {
    return FORM_STEP_STATUS.INITIAL;
  }

  return getInvalidFields(state).length ? FORM_STEP_STATUS.IN_PROGRESS : FORM_STEP_STATUS.COMPLETED;
}

export function processForSubmit(state :Map<*, *>) :Object {
  const dispositions = state.get(DISPOSITIONS, List());
  let newState = state
    .set(
      POST_PROCESS_FIELDS.VERBAL_REFERRAL_INDICATOR,
      dispositions.includes(DISPOSITION_TYPES.VERBAL_REFERRAL)
    ).set(
      POST_PROCESS_FIELDS.HOSPITAL_TRANPORT,
      dispositions.includes(DISPOSITION_TYPES.HOSPITAL)
    ).set(
      POST_PROCESS_FIELDS.NARCAN_ADMINISTERED,
      dispositions.includes(DISPOSITION_TYPES.ADMINISTERED_DRUG)
    ).set(
      POST_PROCESS_FIELDS.ARRESTABLE_OFFENSE,
      dispositions.includes(DISPOSITION_TYPES.ARRESTABLE_OFFENSE)
    )
    .set(
      POST_PROCESS_FIELDS.TRANSPORT_INDICATOR,
      dispositions.includes(DISPOSITION_TYPES.COURTESY_TRANPORT)
    );

  let formID = state.get(REPORT_NUMBER, '');
  if (!formID.trim().length) {
    formID = randomUUID();
  }

  const incidentDT = DateTime.fromISO(state.get(INCIDENT_DATE_TIME));
  newState = newState.set(INCIDENT_DATE_TIME, incidentDT.isValid ? incidentDT.toISO() : '');

  newState = newState.set(POST_PROCESS_FIELDS.FORM_ID, formID);


  // handle arrestable offenses
  const arrestableOffense = state.get(ARRESTABLE_OFFENSES, List());

  newState = newState.set(
    POST_PROCESS_FIELDS.CRIMES_AGAINST_PERSON,
    arrestableOffense.includes(CRIMES_AGAINST_PERSON)
  );

  newState = newState.set(
    POST_PROCESS_FIELDS.FELONY_COMMITTED,
    arrestableOffense.includes(FELONY)
  );

  if (arrestableOffense.includes(ARRESTED)) {
    newState = newState.set(POST_PROCESS_FIELDS.ARREST_INDICATOR, true);
  }
  else if (arrestableOffense.includes(NOT_ARRESTED)) {
    newState = newState.set(POST_PROCESS_FIELDS.ARREST_INDICATOR, false);
  }

  // handle no action values
  const noActionValues = state.get(NO_ACTION_VALUES, List());

  newState = newState.set(
    POST_PROCESS_FIELDS.UNABLE_TO_CONTACT,
    noActionValues.includes(UNABLE_TO_CONTACT)
  );

  newState = newState.set(
    POST_PROCESS_FIELDS.NO_ACTION_POSSIBLE,
    noActionValues.includes(NO_ACTION_NECESSARY)
  );

  newState = newState.set(
    POST_PROCESS_FIELDS.RESOURCES_DECLINED,
    noActionValues.includes(RESOURCES_DECLINED)
  );

  return newState.toJS();
}
