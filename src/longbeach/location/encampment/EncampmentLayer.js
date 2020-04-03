// @flow
import React from 'react';

import { icon } from '@fortawesome/fontawesome-svg-core';
import { faMapMarker } from '@fortawesome/pro-solid-svg-icons';
import { List } from 'immutable';
import { Feature, Layer } from 'react-mapbox-gl';

import { OPENLATTICE_ID_FQN } from '../../../edm/DataModelFqns';
import { getCoordinates } from '../../map/MapUtils';

const MapPin = new Image();
MapPin.src = `data:image/svg+xml;utf8,${icon(faMapMarker).html[0]}`;
const images = ['mapPin', MapPin];
const layout = {
  'icon-image': 'mapPin',
  'text-field': ['get', 'index'],
  'icon-allow-overlap': true,
  'text-allow-overlap': true,
  'text-offset': [0, -0.2],
  'icon-size': 0.2,
  'text-size': 14,
};
const paint = {
  'text-color': '#fff',
};

type Props = {
  encampmentLocations :List;
  onFeatureClick ? :(data, feature) => void;
};

const EncampmentLayer = (props :Props) => {
  const { onFeatureClick, encampmentLocations } = props;
  if (encampmentLocations.isEmpty()) return null;

  return (
    <Layer
        type="symbol"
        images={images}
        layout={layout}
        paint={paint}>
      {
        encampmentLocations.map((location, index) => {
          const key = location.getIn([OPENLATTICE_ID_FQN, 0]);
          const coordinates = getCoordinates(location);
          const handleMouseEnter = (payload) => {
            const { map } = payload;
            map.getCanvas().style.cursor = 'pointer';
          };

          const handleMouseLeave = (payload) => {
            const { map } = payload;
            map.getCanvas().style.cursor = '';
          };

          const handleClick = (payload) => {
            onFeatureClick(location, payload);
          };

          return (
            <Feature
                key={key}
                properties={{ index: index + 1 }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
                coordinates={coordinates}
                location={location} />
          );
        }).toJS()
      }
    </Layer>
  );
};

EncampmentLayer.defaultProps = {
  onFeatureClick: () => {}
};

export default EncampmentLayer;
