import React from 'react';
import styled from 'styled-components';
import { Feature, Layer } from 'react-mapbox-gl';
import { Map } from 'immutable';

import { getCoordinates } from '../../../map/MapUtils';
import { isFamilyHome } from '../../../../utils/DataUtils';

const RADIUS = 500;

export default class familyHomeRadius extends React.Component {

  metersToPixelsAtMaxZoom = (meters, latitude) => meters / 0.075 / Math.cos((latitude * Math.PI) / 180);

  milesToPixelsAtMaxZoom = (miles, latitude) => this.metersToPixelsAtMaxZoom(miles * 1609.34, latitude);

  render() {
    const { provider } = this.props;

    if (!isFamilyHome(provider)) {
      return null;
    }

    const [longitude, latitude] = getCoordinates(provider);

    if (!latitude || !longitude) {
      return null;
    }

    return (
      <Layer
          type="circle"
          id="familyHomeRadius"
          paint={{
            'circle-opacity': 0.27,
            'circle-color': '#6124e2',
            'circle-radius': {
              stops: [
                [0, 0],
                [20, this.metersToPixelsAtMaxZoom(RADIUS, latitude)]
              ],
              base: 2
            },
          }}>
        <Feature coordinates={[longitude, latitude]} />
      </Layer>
    );
  }

}
