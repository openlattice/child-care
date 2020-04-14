// @flow
import React from 'react';

import { faHome, faMapMarkerAlt } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { Colors } from 'lattice-ui-kit';
import { Marker } from 'react-mapbox-gl';

import { getCoordinates } from '../../../map/MapUtils';
import { isFamilyHome } from '../../../../utils/DataUtils';
import familyHomeIcon from '../../../../assets/svg/familyhomeicon.svg';

const { PURPLES } = Colors;

type Props = {
  provider :Map;
};

const SelectedProviderMarker = ({ provider } :Props) => {
  if (!Map.isMap(provider)) return null;

  const coordinates = getCoordinates(provider);

  const icon = isFamilyHome(provider) ? <img src={familyHomeIcon} alt="" /> : <FontAwesomeIcon icon={faMapMarkerAlt} color={PURPLES[1]} size="3x" />;

  return (
    <Marker
        anchor="bottom"
        coordinates={coordinates}
        style={{ zIndex: 0 }}>
      {icon}
    </Marker>
  );
};

export default SelectedProviderMarker;
