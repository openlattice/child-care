// @flow
import React from 'react';

import { icon } from '@fortawesome/fontawesome-svg-core';
import { faMapMarkerPlus } from '@fortawesome/pro-solid-svg-icons';
import { List } from 'immutable';
import { Feature, Layer } from 'react-mapbox-gl';

import { OPENLATTICE_ID_FQN } from '../../../edm/DataModelFqns';
import { getCoordinates } from '../../map/MapUtils';

const HospitalPin = new Image(12, 16);
HospitalPin.src = `data:image/svg+xml;utf8,${icon(faMapMarkerPlus, {
  styles: { color: 'black' }
}).html[0]}`;
const images = ['hospitalPin', HospitalPin];
const layout = { 'icon-image': 'hospitalPin' };

type Props = {
  hospitalLocations :List;
  onFeatureClick ? :(data, feature) => void;
};

const HospitalsLocationLayer = (props :Props) => {
  const { onFeatureClick, hospitalLocations } = props;
  if (hospitalLocations.isEmpty()) return null;

  return (
    <Layer
        type="symbol"
        layout={layout}
        images={images}>
      {
        hospitalLocations.map((location) => {
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
            const [lng, lat] = coordinates;
            const feature = { lngLat: { lng, lat } };
            onFeatureClick(location, feature);
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

HospitalsLocationLayer.defaultProps = {
  onFeatureClick: () => {}
};

export default HospitalsLocationLayer;
