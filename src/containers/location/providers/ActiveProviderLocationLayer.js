// @flow
import React from 'react';

import { List } from 'immutable';

import activePin from '../../../assets/svg/activeprovidericon.svg';

import ProviderLocationLayer from './ProviderLocationLayer';

const MapPin = new Image(15, 20);
MapPin.src = activePin;
const images = ['activeMapPin', MapPin];
const layout = { 'icon-image': 'activeMapPin' };

type Props = {
  providerLocations :List;
  onFeatureClick ? :(data, feature) => void;
};

const ActiveProviderLocationLayer = (props :Props) => (
  <ProviderLocationLayer images={images} layout={layout} {...props} />
);

ActiveProviderLocationLayer.defaultProps = {
  onFeatureClick: () => {}
};

export default ActiveProviderLocationLayer;
