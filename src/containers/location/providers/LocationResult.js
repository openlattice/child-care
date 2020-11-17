// @flow

import React from 'react';

import { Map } from 'immutable';
import { useSelector } from 'react-redux';

import ProviderResult from '../../styled/ProviderResult';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';

type Props = {
  result :Map;
}
const {
  LAT, LON, PROVIDER_LOCATIONS, SELECTED_OPTION
} = PROVIDERS;

const LocationResult = (props :Props) => {

  const { result: locationEKID } = props;

  const getText = useSelector(getTextFnFromState);

  const providerState = useSelector((store) => store.get(STATE.LOCATIONS, Map()));
  const provider = providerState.getIn([PROVIDER_LOCATIONS, locationEKID], Map());

  const lat = providerState.getIn([SELECTED_OPTION, LAT]);
  const lon = providerState.getIn([SELECTED_OPTION, LON]);

  return (
    <ProviderResult provider={provider} coordinates={[lat, lon]} getText={getText} />
  );
};

export default React.memo<Props>(LocationResult);
