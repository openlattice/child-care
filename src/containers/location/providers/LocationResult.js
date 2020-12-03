// @flow

import React from 'react';

import { get, Map } from 'immutable';
import { useSelector } from 'react-redux';

import ProviderResult from '../../styled/ProviderResult';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';

type Props = {
  result :Map;
}

const { LOCATIONS } = STATE;
const {
  CURRENT_POSITION,
  LAT,
  LON,
  PROVIDER_LOCATIONS,
  SELECTED_OPTION
} = PROVIDERS;

const LocationResult = (props :Props) => {

  const { result: locationEKID } = props;

  const getText = useSelector(getTextFnFromState);

  const selectedOption = useSelector((store) => store.getIn([LOCATIONS, SELECTED_OPTION]));
  const currentPosition = useSelector((store) => store.getIn([LOCATIONS, CURRENT_POSITION]));
  const provider = useSelector((store) => store.getIn([LOCATIONS, PROVIDER_LOCATIONS, locationEKID], Map()));

  const latCP = currentPosition?.coords?.latitude;
  const lonCP = currentPosition?.coords?.longitude;
  const lat = get(selectedOption, LAT, latCP);
  const lon = get(selectedOption, LON, lonCP);

  return (
    <ProviderResult provider={provider} coordinates={[lat, lon]} getText={getText} />
  );
};

export default React.memo<Props>(LocationResult);
