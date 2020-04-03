// @flow
import { OrderedMap } from 'immutable';
import * as FQN from '../../edm/DataModelFqns';

const resultLabels = OrderedMap({
  [FQN.PERSON_LAST_NAME_FQN]: 'Last name',
  [FQN.PERSON_FIRST_NAME_FQN]: 'First name',
  [FQN.PERSON_MIDDLE_NAME_FQN]: 'Middle name',
  [FQN.PERSON_SEX_FQN]: 'Sex',
  [FQN.PERSON_RACE_FQN]: 'Race',
  [FQN.PERSON_DOB_FQN]: 'DOB',
});

const searchFields = [
  {
    id: 'lastName',
    label: 'Last Name',
  },
  {
    id: 'firstName',
    label: 'First Name',
  },
  {
    id: 'dob',
    label: 'Date of Birth',
    type: 'date'
  }
];

export {
  resultLabels,
  searchFields,
};
