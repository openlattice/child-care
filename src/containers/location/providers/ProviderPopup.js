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
import { FACILITY_STATUSES } from '../../../utils/DataConstants';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { LABELS } from '../../../utils/constants/Labels';

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

const OpenClosedTag = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 10px;
  line-height: 17px;

  text-align: left;
  color: ${(props) => (props.isOpen ? '#009D48' : '#C61F08')};
`;

type Props = {
  coordinates :[number, number];
  isOpen :boolean;
  stayAwayLocation :Map;
  onClose :() => void;
  renderText :Function
};

const ProviderPopup = ({
  coordinates,
  isOpen,
  onClose,
  provider,
  renderText
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

  const isOperating = getValue(provider, PROPERTY_TYPES.STATUS) === FACILITY_STATUSES.OPEN;

  const capacities = [];
  const yr = renderText(LABELS.YR);
  if (getValue(provider, PROPERTY_TYPES.CAPACITY_UNDER_2)) {
    capacities.push(`0 ${yr} - 1 ${yr}`);
  }
  if (getValue(provider, PROPERTY_TYPES.CAPACITY_2_to_5)) {
    capacities.push(`2 ${yr} - 5 ${yr}`);
  }
  if (getValue(provider, PROPERTY_TYPES.CAPACITY_OVER_5)) {
    capacities.push(`6 ${renderText(LABELS.YR_AND_UP)}`);
  }
  if (!capacities.length) {
    capacities.push(renderText(LABELS.UNKNOWN_AGE_LIMITATIONS));
  }

  const address = [street, city, zip].filter(v => v).join(', ');

  const dispatch = useDispatch();

  const handleViewProfile = () => {
    dispatch(selectProvider(provider));
  };

  return (
    <Popup coordinates={coordinates}>
      <OpenClosedTag isOpen={isOperating}>
        {renderText(isOperating ? LABELS.OPEN : LABELS.CLOSED)}
      </OpenClosedTag>
      <ActionBar>
        <strong>{name}</strong>
        <CloseButton size="sm" mode="subtle" icon={CloseIcon} onClick={onClose} />
      </ActionBar>
      <IconDetail content={type} />
      <IconDetail content={`${city}, CA`} />
      <IconDetail content={capacities.join(', ')} />
      <LinkButton onClick={handleViewProfile}>{renderText(LABELS.VIEW_PROVIDER)}</LinkButton>
    </Popup>
  );
};

export default ProviderPopup;
