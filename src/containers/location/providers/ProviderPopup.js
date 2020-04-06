// @flow
import React from 'react';

import styled from 'styled-components';
import { faTimes  } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { IconButton, Colors } from 'lattice-ui-kit';
import { Popup } from 'react-mapbox-gl';
import { useDispatch } from 'react-redux';

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
import { selectProvider } from './LocationsActions';
import { getAddressFromLocation } from '../../../utils/AddressUtils';
import { getValue, getValues } from '../../../utils/DataUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';

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

const LinkButton = styled.div`
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  color: ${Colors.PURPLES[1]};
  text-decoration: none;
  text-align: center;
  margin-top: 10px;
  :hover {
    text-decoration: underline;
  }
`;

type Props = {
  coordinates :[number, number];
  isOpen :boolean;
  stayAwayLocation :Map;
  onClose :() => void;
};

const ProviderPopup = ({
  coordinates,
  isOpen,
  onClose,
  provider
} :Props) => {
  if (!isOpen) return null;

  const providerEKID = provider.getIn([OPENLATTICE_ID_FQN, 0]);

  const name = getValue(provider, PROPERTY_TYPES.FACILITY_NAME);
  const type = getValues(provider, PROPERTY_TYPES.FACILITY_TYPE);
  const status = getValues(provider, PROPERTY_TYPES.STATUS);
  const url = getValue(provider, PROPERTY_TYPES.URL);

  const street = getValue(provider, PROPERTY_TYPES.ADDRESS);
  const city = getValue(provider, PROPERTY_TYPES.CITY);
  const zip = getValue(provider, PROPERTY_TYPES.ZIP);

  const address = [street, city, zip].filter(v => v).join(', ');

  const dispatch = useDispatch();

  const handleViewProfile = () => {
    dispatch(selectProvider(provider));
  };

  return (
    <Popup coordinates={coordinates}>
      <ActionBar>
        <strong>{name}</strong>
        <CloseButton size="sm" mode="subtle" icon={CloseIcon} onClick={onClose} />
      </ActionBar>
      <IconDetail content={type} />
      <IconDetail content={status} />
      <IconDetail content={url} />
      <IconDetail content={address} />
      <LinkButton onClick={handleViewProfile}>View Provider</LinkButton>
    </Popup>
  );
};

export default ProviderPopup;
