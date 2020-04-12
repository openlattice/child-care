// @flow
import React from 'react';

import styled from 'styled-components';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import { Colors, IconButton } from 'lattice-ui-kit';
import { Popup } from 'react-mapbox-gl';
import { useDispatch } from 'react-redux';

import { selectProvider } from './LocationsActions';
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
import { FACILITY_STATUSES } from '../../../utils/DataConstants';
import {
  getValue,
  getValues,
  getAgesServedFromEntity,
  isProviderActive
} from '../../../utils/DataUtils';
import { getDobFromPerson, getLastFirstMiFromPerson } from '../../../utils/PersonUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { LABELS, FACILITY_TYPE_LABELS } from '../../../utils/constants/Labels';

const ActionBar = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;


  strong {
    color: ${(props) => (props.isInactive ? '#9094A4' : '#555E6F')};
    font-weight: ${(props) => (props.isInactive ? 400 : 600)};
    font-size: 16px;
  }

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
    cursor: pointer;
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
  provider :Map;
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

  const providerEKID = provider.getIn([OPENLATTICE_ID_FQN, 0]);

  const name = getValue(provider, PROPERTY_TYPES.FACILITY_NAME);
  const type = provider.get(PROPERTY_TYPES.FACILITY_TYPE, List())
    .map(v => renderText(FACILITY_TYPE_LABELS[v]));
  const status = getValues(provider, PROPERTY_TYPES.STATUS);
  const url = getValue(provider, PROPERTY_TYPES.URL);

  const street = getValue(provider, PROPERTY_TYPES.ADDRESS);
  const city = getValue(provider, PROPERTY_TYPES.CITY);
  const zip = getValue(provider, PROPERTY_TYPES.ZIP);

  const isOperating = getValue(provider, PROPERTY_TYPES.STATUS) === FACILITY_STATUSES.OPEN;

  const ages = getAgesServedFromEntity(provider, renderText);

  const isInactive = !isProviderActive(provider);

  const dispatch = useDispatch();

  const handleViewProfile = () => {
    dispatch(selectProvider(provider));
  };

  if (!isOpen) return null;

  return (
    <Popup coordinates={coordinates}>
      <ActionBar isInactive={isInactive}>
        <strong>{name}</strong>
        <CloseButton size="sm" mode="subtle" icon={CloseIcon} onClick={onClose} />
      </ActionBar>
      <IconDetail content={type} isInactive={isInactive} />
      <IconDetail content={`${city}, CA`} isInactive={isInactive} />
      <IconDetail content={ages} isInactive={isInactive} />
      {isInactive
        ? <IconDetail content={renderText(LABELS.CLOSED_DURING_COVID)} isInactive={isInactive} />
        : null}
      <LinkButton onClick={handleViewProfile}>{renderText(LABELS.VIEW_PROVIDER)}</LinkButton>
    </Popup>
  );
};

export default ProviderPopup;
