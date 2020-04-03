// @flow

import React from 'react';

import { Map } from 'immutable';
import { Constants } from 'lattice';
import { useSelector } from 'react-redux';

import { STAY_AWAY_STORE_PATH } from './constants';

import LongBeachResult from '../../styled/LongBeachResult';

const { OPENLATTICE_ID_FQN } = Constants;

type Props = {
  result :Map;
}

const LongBeachLocationResult = (props :Props) => {

  const { result: locationEKID } = props;

  const person = useSelector((store) => {
    const stayAwayEKID = store.getIn([...STAY_AWAY_STORE_PATH, 'stayAway', locationEKID, OPENLATTICE_ID_FQN, 0]);
    return store.getIn([...STAY_AWAY_STORE_PATH, 'people', stayAwayEKID], Map());
  });
  const personEKID = person.getIn([OPENLATTICE_ID_FQN, 0]);
  const profilePicture = useSelector((store) => store
    .getIn([...STAY_AWAY_STORE_PATH, 'profilePictures', personEKID], Map()));
  const stayAwayLocation = useSelector((store) => store
    .getIn([...STAY_AWAY_STORE_PATH, 'stayAwayLocations', locationEKID], Map()));

  return (
    <LongBeachResult
        person={person}
        stayAwayLocation={stayAwayLocation}
        profilePicture={profilePicture} />
  );
};

export default React.memo<Props>(LongBeachLocationResult);
