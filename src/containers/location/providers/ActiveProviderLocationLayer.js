// @flow
import React from 'react';

import { List, Map } from 'immutable';

import activePin from '../../../assets/svg/activeprovidericon.svg';

import ProviderLocationLayer from './ProviderLocationLayer';

const MapPin = new Image(15, 20);
MapPin.src = activePin;
const images = ['activeMapPin', MapPin];
const layout = { 'icon-image': 'activeMapPin' };

type Props = {
  providerLocations :List;
  onFeatureClick ?:(location :Map, feature :{}) => void;
};

const ActiveProviderLocationLayer = (props :Props) => (
  /* eslint-disable */
  // $FlowFixMe
  <ProviderLocationLayer images={images} layout={layout} {...props} />
);

ActiveProviderLocationLayer.defaultProps = {
  onFeatureClick: () => {}
};

export default ActiveProviderLocationLayer;
