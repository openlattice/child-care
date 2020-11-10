// @flow
import React from 'react';

import { List, Map } from 'immutable';
import { Feature, Layer } from 'react-mapbox-gl';

import { OPENLATTICE_ID_FQN } from '../../../utils/constants/DataModelConstants';
import { getCoordinates } from '../../map/MapUtils';

type Props = {
  images :any[];
  layout :{};
  providerLocations :List;
  onFeatureClick ?:(location :Map, feature :{}) => void;
};

const ProviderLocationLayer = (props :Props) => {
  const {
    onFeatureClick,
    providerLocations,
    images,
    layout
  } = props;
  if (providerLocations.isEmpty()) return null;

  return (
    <Layer
        type="symbol"
        layout={layout}
        images={images}>
      {
        providerLocations.map((location) => {
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

          const handleClick = () => {
            const [lng, lat] = coordinates;
            const feature = { lngLat: { lng, lat } };
            if (onFeatureClick) {
              onFeatureClick(location, feature);
            }
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

ProviderLocationLayer.defaultProps = {
  onFeatureClick: () => {}
};

export default ProviderLocationLayer;
