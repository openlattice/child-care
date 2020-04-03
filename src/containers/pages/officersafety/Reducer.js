/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';

import { SET_INPUT_VALUE, SET_INPUT_VALUES } from './ActionFactory';
import { OFFICER_SAFETY, OTHER } from '../../../utils/constants/CrisisReportConstants';
import { FORM_STEP_STATUS } from '../../../utils/constants/FormConstants';

const {
  TECHNIQUES,
  HAD_WEAPON,
  WEAPONS,
  OTHER_WEAPON,
  THREATENED_VIOLENCE,
  THREATENED_PERSON_RELATIONSHIP,
  HAD_INJURIES,
  INJURED_PARTIES,
  OTHER_INJURED_PERSON,
  INJURY_TYPE,
  OTHER_INJURY_TYPE
} = OFFICER_SAFETY;

const INITIAL_STATE :Map<*, *> = fromJS({
  [TECHNIQUES]: [],
  [HAD_WEAPON]: false,
  [WEAPONS]: [],
  [OTHER_WEAPON]: '',
  [THREATENED_VIOLENCE]: false,
  [THREATENED_PERSON_RELATIONSHIP]: [],
  [HAD_INJURIES]: false,
  [INJURED_PARTIES]: [],
  [OTHER_INJURED_PERSON]: '',
  [INJURY_TYPE]: [],
  [OTHER_INJURY_TYPE]: ''
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

  if (state.get(HAD_WEAPON)) {
    const weaponList = state.get(WEAPONS, List());
    if (!weaponList.size) {
      invalidFields.push(WEAPONS);
    }
    else if (weaponList.includes(OTHER) && !state.get(OTHER_WEAPON).length) {
      invalidFields.push(WEAPONS);
    }
  }

  if (state.get(HAD_INJURIES)) {
    if (!state.get(INJURED_PARTIES, List()).size) {
      invalidFields.push(INJURED_PARTIES);
    }
    else if (state.get(INJURED_PARTIES, List()).includes(OTHER) && !state.get(OTHER_INJURED_PERSON, '').length) {
      invalidFields.push(INJURED_PARTIES);
    }

    if (state.get(INJURY_TYPE, List()).includes(OTHER) && !state.get(OTHER_INJURY_TYPE).length) {
      invalidFields.push(INJURY_TYPE);
    }
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
  return state.toJS();
}
