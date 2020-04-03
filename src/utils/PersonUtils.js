// @flow
import { Map, getIn } from 'immutable';

import { getAgeFromIsoDate, getDateShortFromIsoDate } from './DateUtils';

import * as FQN from '../edm/DataModelFqns';

const getLastFirstMiFromPerson = (person :Map | Object, middleInitialOnly :boolean = false) => {
  const firstName = getIn(person, [FQN.PERSON_FIRST_NAME_FQN, 0], '').trim();
  const last = getIn(person, [FQN.PERSON_LAST_NAME_FQN, 0], '').trim();
  const middle = getIn(person, [FQN.PERSON_MIDDLE_NAME_FQN, 0], '').trim();
  let lastName = '';
  let middleInitial = '';

  if (last) {
    lastName = `${last},`;
  }

  if (middle) {
    middleInitial = middleInitialOnly ? `${middle.charAt(0)}.` : middle;
  }

  return `${lastName} ${firstName} ${middleInitial}`;
};

const getFirstLastFromPerson = (person :Map | Object) => {
  const firstName = getIn(person, [FQN.PERSON_FIRST_NAME_FQN, 0], '').trim();
  const last = getIn(person, [FQN.PERSON_LAST_NAME_FQN, 0], '').trim();

  return `${firstName} ${last}`;
};

const getDobFromPerson = (person :Map | Object, invalidValue :any = '') :string => {
  const dobStr = getIn(person, [FQN.PERSON_DOB_FQN, 0], '');
  return getDateShortFromIsoDate(dobStr, invalidValue);
};


const getPersonAge = (person :Map | Object, asNumber :boolean = false, invalidValue :any = '') => {
  const dobStr = getIn(person, [FQN.PERSON_DOB_FQN, 0], '');
  return getAgeFromIsoDate(dobStr, asNumber, invalidValue);
};

export {
  getDobFromPerson,
  getFirstLastFromPerson,
  getLastFirstMiFromPerson,
  getPersonAge,
};
