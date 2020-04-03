// @flow
import React from 'react';

import { Colors } from 'lattice-ui-kit';
import { Feature, Layer } from 'react-mapbox-gl';

import { distanceToPixelsAtMaxZoom, getCoordinates } from './MapUtils';
import { LAYERS, MAP_STYLE } from './constants';

const { PURPLES } = Colors;

type Props = {
  mapMode ?:string;
  location :Map;
  radius :number;
  unit ?:string;
};

const RadiusLayer = (props :Props) => {

  const {
    mapMode,
    location,
    radius,
    unit,
  } = props;

  const color = mapMode === MAP_STYLE.DEFAULT ? PURPLES[2] : PURPLES[6];
  const [longitude, latitude] = getCoordinates(location);
  if (radius && latitude && longitude) {
    return (
      <Layer
          type="circle"
          id={LAYERS.RADIUS}
          paint={{
            'circle-opacity': 0.1,
            'circle-color': color,
            'circle-stroke-color': color,
            'circle-stroke-width': 1,
            'circle-radius': {
              stops: [
                [0, 0],
                [20, distanceToPixelsAtMaxZoom(radius, latitude, unit)]
              ],
              base: 2
            },
          }}>
        <Feature coordinates={[longitude, latitude]} />
      </Layer>
    );
  }

  return null;
};

RadiusLayer.defaultProps = {
  mapMode: MAP_STYLE.DEFAULT,
  radius: 100,
  unit: 'yd'
};

export default RadiusLayer;
