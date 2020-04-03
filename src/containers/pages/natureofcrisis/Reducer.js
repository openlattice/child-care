/*
 * @flow
 */

import { List, Map, fromJS } from 'immutable';

import { SET_INPUT_VALUE, SET_INPUT_VALUES } from './ActionFactory';
import { CRISIS_NATURE, OTHER, POST_PROCESS_FIELDS } from '../../../utils/constants/CrisisReportConstants';
import { FORM_STEP_STATUS } from '../../../utils/constants/FormConstants';
import { HOMELESS_STR } from './Constants';

const {
  NATURE_OF_CRISIS,
  BIOLOGICAL_CAUSES,
  CHEMICAL_CAUSES,
  ASSISTANCE,
  OTHER_ASSISTANCE,
  HOUSING
} = CRISIS_NATURE;

const INITIAL_STATE :Map<*, *> = fromJS({
  [NATURE_OF_CRISIS]: [],
  [BIOLOGICAL_CAUSES]: [],
  [CHEMICAL_CAUSES]: [],
  [ASSISTANCE]: [],
  [OTHER_ASSISTANCE]: '',
  [HOUSING]: ''
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

  if (!state.get(NATURE_OF_CRISIS, List()).size) {
    invalidFields.push(NATURE_OF_CRISIS);
  }

  if (!state.get(ASSISTANCE, List()).size) {
    invalidFields.push(ASSISTANCE);
  }
  else if (state.get(ASSISTANCE, List()).includes(OTHER) && !state.get(OTHER_ASSISTANCE).length) {
    invalidFields.push(ASSISTANCE);
  }

  if (!state.get(HOUSING).length) {
    invalidFields.push(HOUSING);
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
  return state
    .set(POST_PROCESS_FIELDS.HOMELESS, state.get(HOUSING, '') === HOMELESS_STR)
    .toJS();
}
