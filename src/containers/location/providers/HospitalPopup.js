// @flow
import React from 'react';

import styled from 'styled-components';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
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
import { getValue, getValues, getAgesServedFromEntity } from '../../../utils/DataUtils';
import { getDobFromPerson, getLastFirstMiFromPerson } from '../../../utils/PersonUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { LABELS } from '../../../utils/constants/Labels';

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

const HospitalPopup = ({
  coordinates,
  isOpen,
  onClose,
  hospital,
  renderText
} :Props) => {

  const name = getValue(hospital, PROPERTY_TYPES.FACILITY_NAME);

  const street = getValue(hospital, PROPERTY_TYPES.ADDRESS);
  const city = getValue(hospital, PROPERTY_TYPES.CITY);
  const zip = getValue(hospital, PROPERTY_TYPES.ZIP);

  const address = [street, city, zip].filter((v) => v).join(', ');


  if (!isOpen) return null;

  return (
    <Popup coordinates={coordinates}>
      <ActionBar>
        <strong>{name}</strong>
        <CloseButton size="sm" mode="subtle" icon={CloseIcon} onClick={onClose} />
      </ActionBar>
      <IconDetail content={address} />
    </Popup>
  );
};

export default HospitalPopup;
