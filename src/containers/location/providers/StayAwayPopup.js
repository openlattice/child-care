// @flow
import React from 'react';

import styled from 'styled-components';
import {
  faBirthdayCake,
  faDraftingCompass,
  faMapMarkerAltSlash,
  faTimes,
  faUser,
  faVenusMars
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { IconButton } from 'lattice-ui-kit';
import { Popup } from 'react-mapbox-gl';
import { useSelector } from 'react-redux';

import { STAY_AWAY_STORE_PATH } from './constants';

import DefaultLink from '../../../components/links/DefaultLink';
import IconDetail from '../../../components/premium/styled/IconDetail';
import {
  PROFILE_ID_PATH,
  PROFILE_VIEW_PATH,
} from '../../../core/router/Routes';
import {
  OPENLATTICE_ID_FQN,
  PERSON_RACE_FQN,
  PERSON_SEX_FQN
} from '../../../edm/DataModelFqns';
import { getAddressFromLocation } from '../../../utils/AddressUtils';
import { getDobFromPerson, getLastFirstMiFromPerson } from '../../../utils/PersonUtils';

const ActionBar = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;
`;

const CloseButton = styled(IconButton)`
  color: inherit;
  padding: 2px;
`;

const CloseIcon = <FontAwesomeIcon icon={faTimes} fixedWidth />;

type Props = {
  coordinates :[number, number];
  isOpen :boolean;
  stayAwayLocation :Map;
  onClose :() => void;
};

const StayAwayPopup = ({
  coordinates,
  isOpen,
  onClose,
  stayAwayLocation
} :Props) => {

  const locationEKID = stayAwayLocation.getIn([OPENLATTICE_ID_FQN, 0]);
  const stayAway = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'stayAway', locationEKID])) || Map();
  const stayAwayEKID = stayAway.getIn([OPENLATTICE_ID_FQN, 0]);
  const person = useSelector((store) => store.getIn([...STAY_AWAY_STORE_PATH, 'people', stayAwayEKID])) || Map();
  const personEKID = person.getIn([OPENLATTICE_ID_FQN, 0]);

  if (!isOpen) return null;

  const fullName = getLastFirstMiFromPerson(person, true);
  const dob :string = getDobFromPerson(person, '---');
  const sex = person.getIn([PERSON_SEX_FQN, 0]);
  const race = person.getIn([PERSON_RACE_FQN, 0]);
  const { name, address } = getAddressFromLocation(stayAwayLocation);
  let nameAndAddress = address;
  if (name && address) {
    nameAndAddress = `${name}\n${address}`;
  }
  // TODO: Replace with true radius
  const radius = '100 yd';

  return (
    <Popup coordinates={coordinates}>
      <ActionBar>
        <strong>{fullName}</strong>
        <CloseButton size="sm" mode="subtle" icon={CloseIcon} onClick={onClose} />
      </ActionBar>
      <IconDetail content={dob} icon={faBirthdayCake} />
      <IconDetail content={race} icon={faUser} />
      <IconDetail content={sex} icon={faVenusMars} />
      <IconDetail content={nameAndAddress} icon={faMapMarkerAltSlash} />
      <IconDetail content={radius} icon={faDraftingCompass} />
      <DefaultLink to={PROFILE_VIEW_PATH.replace(PROFILE_ID_PATH, personEKID)}>View Profile</DefaultLink>
    </Popup>
  );
};

export default StayAwayPopup;
