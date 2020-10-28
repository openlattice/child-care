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
  onFeatureClick ?:(location :Map, feature :{}) => void;
  providerLocations :List;
};

const ActiveProviderLocationLayer = ({
  onFeatureClick,
  providerLocations,
} :Props) => (
  <ProviderLocationLayer
      images={images}
      layout={layout}
      onFeatureClick={onFeatureClick}
      providerLocations={providerLocations} />
);

ActiveProviderLocationLayer.defaultProps = {
  onFeatureClick: () => {}
};

export default ActiveProviderLocationLayer;
