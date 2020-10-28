// @flow
import React from 'react';

import { List, Map } from 'immutable';

import inactivePin from '../../../assets/svg/inactiveprovidericon.svg';

import ProviderLocationLayer from './ProviderLocationLayer';

const MapPin = new Image(15, 20);
MapPin.src = inactivePin;
const images = ['inactiveMapPin', MapPin];
const layout = { 'icon-image': 'inactiveMapPin' };

type Props = {
  providerLocations :List;
  onFeatureClick ?:(location :Map, feature :{}) => void;
};

const InactiveProviderLocationLayer = (props :Props) => (
  /* eslint-disable */
  // $FlowFixMe
  <ProviderLocationLayer images={images} layout={layout} {...props} />
);

InactiveProviderLocationLayer.defaultProps = {
  onFeatureClick: () => {}
};

export default InactiveProviderLocationLayer;
