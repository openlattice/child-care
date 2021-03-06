// @flow
import React from 'react';

import styled from 'styled-components';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import { Colors, IconButton } from 'lattice-ui-kit';
import { Popup } from 'react-mapbox-gl';
import { useDispatch } from 'react-redux';

import IconDetail from '../../../components/premium/styled/IconDetail';
import { VACANCY_COLORS } from '../../../shared/Colors';
import {
  getAgesServedFromEntity,
  getValue,
  isProviderActive,
  renderFacilityName
} from '../../../utils/DataUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { FACILITY_TYPE_LABELS, LABELS } from '../../../utils/constants/labels';
import { selectProvider } from '../LocationsActions';
import type { Translation } from '../../../types';

const { NEUTRAL, BLUE } = Colors;

const ActionBar = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: space-between;

  strong {
    color: ${(props) => (props.isInactive ? NEUTRAL.N500 : NEUTRAL.N700)};
    font-size: 16px;
    font-weight: ${(props) => (props.isInactive ? 400 : 600)};
  }
`;

const CloseButton = styled(IconButton)`
  color: inherit;
  padding: 2px;
`;

const CloseIcon = <FontAwesomeIcon icon={faTimes} fixedWidth />;

const LinkButton = styled.div`
  color: ${BLUE.B400};
  font-size: 14px;
  font-weight: 600;
  text-align: center;
  text-decoration: none;
  text-transform: uppercase;
  margin-top: 10px;

  :hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;

const OpenClosedTag = styled.div`
  color: ${(props) => props.color};
  font-size: 14px;
  font-style: normal;
  font-weight: normal;
  line-height: 17px;
`;

type Props = {
  coordinates :[number, number];
  isOpen :boolean;
  onClose :() => void;
  provider :Map;
  getText :(translation :Translation) => string;
};

const ProviderPopup = ({
  coordinates,
  isOpen,
  onClose,
  provider,
  getText
} :Props) => {
  const name = renderFacilityName(provider, getText);
  const type = provider.get(PROPERTY_TYPES.FACILITY_TYPE, List())
    .map((v) => getText(FACILITY_TYPE_LABELS[v]));

  const city = getValue(provider, PROPERTY_TYPES.CITY);

  const hasVacancies = getValue(provider, PROPERTY_TYPES.VACANCIES);
  let vacancyLabel = LABELS.AVAILABILITY_UNKNOWN;
  let vacancyColor = VACANCY_COLORS.UNKNOWN;
  if (hasVacancies !== '') {
    vacancyLabel = hasVacancies ? LABELS.SPOTS_OPEN : LABELS.BOOKED;
    vacancyColor = hasVacancies ? VACANCY_COLORS.OPEN : VACANCY_COLORS.CLOSED;
  }

  const ages = getAgesServedFromEntity(provider, getText);

  const isInactive = !isProviderActive(provider);

  const dispatch = useDispatch();

  const handleViewProfile = () => {
    dispatch(selectProvider(provider));
  };

  if (!isOpen) return null;

  return (
    <Popup coordinates={coordinates}>
      {
        !isInactive && (
          <OpenClosedTag color={vacancyColor}>
            {getText(vacancyLabel)}
          </OpenClosedTag>
        )
      }
      <ActionBar isInactive={isInactive}>
        <strong>{name}</strong>
        <CloseButton size="sm" mode="subtle" icon={CloseIcon} onClick={onClose} />
      </ActionBar>
      <IconDetail content={type} isInactive={isInactive} />
      <IconDetail content={`${city}, CA`} isInactive={isInactive} />
      <IconDetail content={ages} isInactive={isInactive} />
      {
        isInactive
          && <IconDetail content={getText(LABELS.CLOSED_DURING_COVID)} isInactive={isInactive} />
      }
      <LinkButton onClick={handleViewProfile}>{getText(LABELS.VIEW_PROVIDER)}</LinkButton>
    </Popup>
  );
};

export default ProviderPopup;
