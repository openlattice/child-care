import React from 'react';
import { Feature, Layer } from 'react-mapbox-gl';
import { Colors } from 'lattice-ui-kit';

import { getCoordinates } from '../../../map/MapUtils';
import { shouldShowLocation } from '../../../../utils/DataUtils';

const { BLUE } = Colors;

const RADIUS = 500;

export default class familyHomeRadius extends React.Component {

  metersToPixelsAtMaxZoom = (meters, latitude) => meters / 0.075 / Math.cos((latitude * Math.PI) / 180);

  milesToPixelsAtMaxZoom = (miles, latitude) => this.metersToPixelsAtMaxZoom(miles * 1609.34, latitude);

  render() {
    const { provider } = this.props;

    const [longitude, latitude] = getCoordinates(provider);

    if (!latitude || !longitude) {
      return null;
    }

    return shouldShowLocation(provider) && (
      <Layer
          type="circle"
          id="familyHomeRadius"
          paint={{
            'circle-opacity': 0.27,
            'circle-color': BLUE.B400,
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
