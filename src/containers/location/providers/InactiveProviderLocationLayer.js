// @flow
import React from 'react';

import { icon } from '@fortawesome/fontawesome-svg-core';
import { faMapMarkerAlt } from '@fortawesome/pro-solid-svg-icons';
import { List } from 'immutable';

import ProviderLocationLayer from './ProviderLocationLayer';

const MapPin = new Image(15, 20);
MapPin.src = `data:image/svg+xml;utf8,${icon(faMapMarkerAlt, {
  styles: { color: '979797' }
}).html[0]}`;
const images = ['inactiveMapPin', MapPin];
const layout = { 'icon-image': 'inactiveMapPin' };

type Props = {
  providerLocations :List;
  onFeatureClick ? :(data, feature) => void;
};

const InactiveProviderLocationLayer = (props :Props) => (
  <ProviderLocationLayer images={images} layout={layout} {...props} />
);

InactiveProviderLocationLayer.defaultProps = {
  onFeatureClick: () => {}
};

export default InactiveProviderLocationLayer;
