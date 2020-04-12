// @flow
import React from 'react';

import { faMapMarkerAlt } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { Colors } from 'lattice-ui-kit';
import { Marker } from 'react-mapbox-gl';

import { getCoordinates } from '../../../map/MapUtils';

const { PURPLES } = Colors;

type Props = {
  provider :Map;
};

const SelectedProviderMarker = ({ provider } :Props) => {
  if (!Map.isMap(provider)) return null;
  const coordinates = getCoordinates(provider);
  return (
    <Marker
        anchor="bottom"
        coordinates={coordinates}
        style={{ zIndex: 0 }}>
      <FontAwesomeIcon icon={faMapMarkerAlt} color={PURPLES[1]} size="3x" />
    </Marker>
  );
};

export default SelectedProviderMarker;
