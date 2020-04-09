// @flow

import React from 'react';

import { Map } from 'immutable';
import { Constants } from 'lattice';
import { useSelector } from 'react-redux';

import { STAY_AWAY_STORE_PATH } from './constants';

import ProviderResult from '../../styled/ProviderResult';
import { getRenderTextFn } from '../../../utils/AppUtils';

const { OPENLATTICE_ID_FQN } = Constants;

type Props = {
  result :Map;
}

const LocationResult = (props :Props) => {

  const { coordinates, result: locationEKID } = props;

  const renderText = useSelector(getRenderTextFn);

  const providerState = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH], Map()));
  const provider = providerState.getIn(['providerLocations', locationEKID], Map());


  const lat = providerState.getIn(['selectedOption', 'lat']);
  const lon = providerState.getIn(['selectedOption', 'lon']);

  return (
    <ProviderResult provider={provider} coordinates={[lat, lon]} renderText={renderText} />
  );
};

export default React.memo<Props>(LocationResult);
