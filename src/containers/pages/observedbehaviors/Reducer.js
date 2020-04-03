/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';

import { SET_INPUT_VALUE, SET_INPUT_VALUES } from './ActionFactory';
import { SUICIDE_BEHAVIORS } from './Constants';
import { OBSERVED_BEHAVIORS, OTHER, POST_PROCESS_FIELDS } from '../../../utils/constants/CrisisReportConstants';
import { FORM_STEP_STATUS } from '../../../utils/constants/FormConstants';

const {
  VETERAN,
  BEHAVIORS,
  OTHER_BEHAVIOR,
  SUICIDE_ATTEMPT_TYPE,
  SUICIDE_METHODS,
  OTHER_SUICIDE_METHOD,
  DEMEANORS,
  OTHER_DEMEANOR
} = OBSERVED_BEHAVIORS;

const INITIAL_STATE :Map<*, *> = fromJS({
  [VETERAN]: false,
  [BEHAVIORS]: [],
  [OTHER_BEHAVIOR]: '',
  [SUICIDE_ATTEMPT_TYPE]: '',
  [SUICIDE_METHODS]: [],
  [OTHER_SUICIDE_METHOD]: '',
  [DEMEANORS]: [],
  [OTHER_DEMEANOR]: ''
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

  if (!state.get(BEHAVIORS, List()).size) {
    invalidFields.push(BEHAVIORS);
  }
  else if (state.get(BEHAVIORS, List()).includes(OTHER) && !state.get(OTHER_BEHAVIOR, '').length) {
    invalidFields.push(BEHAVIORS);
  }

  if (!state.get(DEMEANORS, List()).size) {
    invalidFields.push(DEMEANORS);
  }
  else if (state.get(DEMEANORS, List()).includes(OTHER) && !state.get(OTHER_DEMEANOR, '').length) {
    invalidFields.push(DEMEANORS);
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
  let newState = state;

  if (state.get(VETERAN)) {
    newState = newState.set(POST_PROCESS_FIELDS.MILITARY_STATUS, 'Veteran');
  }

  if (state.get(BEHAVIORS, List()).includes(SUICIDE_BEHAVIORS)) {
    newState = newState.set(POST_PROCESS_FIELDS.IS_SUICIDAL, true);
  }

  return newState.toJS();
}
