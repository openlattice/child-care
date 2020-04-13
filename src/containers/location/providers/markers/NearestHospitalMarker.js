// @flow
import React from 'react';

import { faHospital } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { Colors } from 'lattice-ui-kit';
import { Marker } from 'react-mapbox-gl';

import { getCoordinates } from '../../../map/MapUtils';

type Props = {
  provider :Map;
};

const GREEN = '#80dfc2';

const NearestHospitalMarker = ({ hospital } :Props) => {
  if (!Map.isMap(hospital)) return null;

  const coordinates = getCoordinates(hospital);

  if (!coordinates[0] || !coordinates[1]) {
    return null;
  }

  return (
    <Marker
        anchor="bottom"
        coordinates={coordinates}
        style={{ zIndex: 0 }}>
      <FontAwesomeIcon icon={faHospital} color={GREEN} size="2x" />
    </Marker>
  );
};

export default NearestHospitalMarker;
