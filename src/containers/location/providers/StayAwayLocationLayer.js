// @flow
import React from 'react';

import { icon } from '@fortawesome/fontawesome-svg-core';
import { faMapMarkerAlt } from '@fortawesome/pro-solid-svg-icons';
import { List } from 'immutable';
import { Feature, Layer } from 'react-mapbox-gl';

import { OPENLATTICE_ID_FQN } from '../../../edm/DataModelFqns';
import { getCoordinates } from '../../map/MapUtils';

const MapPin = new Image(12, 16);
MapPin.src = `data:image/svg+xml;utf8,${icon(faMapMarkerAlt).html[0]}`;
const images = ['mapPin', MapPin];
const layout = { 'icon-image': 'mapPin' };

type Props = {
  stayAwayLocations :List;
  onFeatureClick ? :(data, feature) => void;
};

const StayAwayLocationLayer = (props :Props) => {
  const { onFeatureClick, stayAwayLocations } = props;
  if (stayAwayLocations.isEmpty()) return null;

  return (
    <Layer
        type="symbol"
        layout={layout}
        images={images}>
      {
        stayAwayLocations.map((location) => {
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

StayAwayLocationLayer.defaultProps = {
  onFeatureClick: () => {}
};

export default StayAwayLocationLayer;
