// @flow
import React from 'react';

import { faMapMarkerAlt } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { Colors } from 'lattice-ui-kit';
import { Marker } from 'react-mapbox-gl';

import { getCoordinates } from '../../../map/MapUtils';
import { shouldHideLocation } from '../../../../utils/DataUtils';
import familyHomeIcon from '../../../../assets/svg/familyhomeicon.svg';

const { BLUE } = Colors;

type Props = {
  provider :Map;
};

const SelectedProviderMarker = ({ provider } :Props) => {
  if (!Map.isMap(provider)) return null;

  const coordinates = getCoordinates(provider);

  const familyHome = shouldHideLocation(provider);

  const icon = familyHome
    ? <img src={familyHomeIcon} alt="" />
    : <FontAwesomeIcon icon={faMapMarkerAlt} color={BLUE.B400} size="3x" />;
  const anchor = familyHome ? 'center' : 'bottom';

  return (
    <Marker
        anchor={anchor}
        coordinates={coordinates}
        style={{ zIndex: 0 }}>
      {icon}
    </Marker>
  );
};

export default SelectedProviderMarker;
