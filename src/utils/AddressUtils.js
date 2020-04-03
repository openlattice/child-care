// @flow
import { Map, getIn } from 'immutable';

import { isNonEmptyString } from './LangUtils';

import * as FQN from '../edm/DataModelFqns';

const getAddressFromLocation = (location :Map = Map()) => {

  const name = getIn(location, [FQN.LOCATION_NAME_FQN, 0], '');
  const street = getIn(location, [FQN.LOCATION_STREET_FQN, 0], '');
  const addressline2 = getIn(location, [FQN.LOCATION_ADDRESS_LINE_2_FQN, 0], '');
  const city = getIn(location, [FQN.LOCATION_CITY_FQN, 0], '');
  const state = getIn(location, [FQN.LOCATION_STATE_FQN, 0], '');
  const zip = getIn(location, [FQN.LOCATION_ZIP_FQN, 0], '');

  const address = [street, addressline2, city, state]
    .filter((line) => isNonEmptyString(line))
    .join(', ').concat(` ${zip}`).trim();

  return {
    name,
    address
  };
};

const formatCityStateZip = (city ? :string, state ? :string, zip ? :string) => {
  let addressLine3 = '';
  if (isNonEmptyString(city)) {
    addressLine3 += city;
    if (isNonEmptyString(state)) {
      addressLine3 += `, ${state} `;
    }
  }
  else if (isNonEmptyString(state)) {
    addressLine3 += `${state} `;
  }

  if (isNonEmptyString(zip)) addressLine3 += zip;

  return addressLine3;
};

export {
  getAddressFromLocation,
  formatCityStateZip
};
