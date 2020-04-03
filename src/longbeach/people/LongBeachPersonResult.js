// @flow

import React from 'react';

import { Map } from 'immutable';
import { Constants } from 'lattice';
import { useSelector } from 'react-redux';

import LongBeachResult from '../styled/LongBeachResult';

const { OPENLATTICE_ID_FQN } = Constants;

type Props = {
  result :Map;
}

const LongBeachPersonResult = (props :Props) => {

  const { result: personEKID } = props;

  const person = useSelector((store) => store.getIn(['longBeach', 'people', 'people', personEKID], Map()));
  const profilePicture = useSelector((store) => store
    .getIn(['longBeach', 'people', 'profilePictures', personEKID], Map()));
  const stayAwayLocation = useSelector((store) => {
    const stayAwayEKID = store.getIn(['longBeach', 'people', 'stayAway', personEKID, OPENLATTICE_ID_FQN, 0]);
    return store.getIn(['longBeach', 'people', 'stayAwayLocations', stayAwayEKID], Map());
  });

  return (
    <LongBeachResult
        person={person}
        stayAwayLocation={stayAwayLocation}
        profilePicture={profilePicture} />
  );
};

export default React.memo<Props>(LongBeachPersonResult);
