// @flow
import React from 'react';

import { Colors } from 'lattice-ui-kit';
import { Feature, Layer } from 'react-mapbox-gl';

import { LAYERS } from './constants';

const { PURPLES } = Colors;

type Props = {
  position :Position;
};

const CurrentPositionLayer = (props :Props) => {

  const {
    position,
  } = props;

  if (position.coords) {
    const { latitude, longitude } = position.coords;
    return (
      <Layer
          type="circle"
          id={LAYERS.CURRENT_POSITION}
          paint={{
            'circle-color': PURPLES[1],
            'circle-stroke-color': PURPLES[1],
            'circle-stroke-width': 5,
            'circle-stroke-opacity': 0.2,
            'circle-radius': 5,
          }}>
        <Feature coordinates={[longitude, latitude]} />
      </Layer>
    );
  }

  return null;
};

export default CurrentPositionLayer;
