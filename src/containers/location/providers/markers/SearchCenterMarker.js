// @flow
import React from 'react';

import { Marker } from 'react-mapbox-gl';

import searchCenterIcon from '../../../../assets/svg/searchcenterpinicon.svg';

type Props = {
  coordinates :{};
};

const SearchCenterMarker = ({ coordinates } :Props) => {
  if (!coordinates[0] || !coordinates[1]) return null;

  return (
    <Marker
        anchor="bottom"
        coordinates={coordinates}
        style={{ zIndex: 0 }}>
      <img src={searchCenterIcon} alt="" />
    </Marker>
  );
};

export default SearchCenterMarker;
