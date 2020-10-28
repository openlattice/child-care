// @flow

import React from 'react';

import { Map } from 'immutable';
import { useSelector } from 'react-redux';

import { STATE } from '../../../utils/constants/StateConstants';

import ProviderResult from '../../styled/ProviderResult';
import { getRenderTextFn } from '../../../utils/AppUtils';

type Props = {
  result :Map;
}

const LocationResult = (props :Props) => {

  const { result: locationEKID } = props;

  const renderText = useSelector(getRenderTextFn);

  const providerState = useSelector((store) => store.get(STATE.LOCATIONS, Map()));
  const provider = providerState.getIn(['providerLocations', locationEKID], Map());

  const lat = providerState.getIn(['selectedOption', 'lat']);
  const lon = providerState.getIn(['selectedOption', 'lon']);

  return (
    <ProviderResult provider={provider} coordinates={[lat, lon]} renderText={renderText} />
  );
};

export default React.memo<Props>(LocationResult);
