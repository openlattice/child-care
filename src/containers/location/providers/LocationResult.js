// @flow

import React from 'react';

import { Map } from 'immutable';
import { Constants } from 'lattice';
import { useSelector } from 'react-redux';

import { STAY_AWAY_STORE_PATH } from './constants';

import ProviderResult from '../../styled/ProviderResult';

const { OPENLATTICE_ID_FQN } = Constants;

type Props = {
  result :Map;
}

const LocationResult = (props :Props) => {

  const { result: locationEKID } = props;

  const provider = useSelector((store) => store
    .getIn([...STAY_AWAY_STORE_PATH, 'providerLocations', locationEKID], Map()));

  return (
    <ProviderResult provider={provider} />
  );
};

export default React.memo<Props>(LocationResult);
