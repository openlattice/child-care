// @flow
import React from 'react';

import { icon } from '@fortawesome/fontawesome-svg-core';
import { faMapMarkerAlt } from '@fortawesome/pro-solid-svg-icons';
import { List } from 'immutable';

import ProviderLocationLayer from './ProviderLocationLayer';

const MapPin = new Image(15, 20);
MapPin.src = `data:image/svg+xml;utf8,${icon(faMapMarkerAlt, {
  styles: { color: '6B9EFF' }
}).html[0]}`;
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
