// @flow
import React from 'react';

import styled from 'styled-components';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import { Colors, IconButton } from 'lattice-ui-kit';
import { Popup } from 'react-mapbox-gl';
import { useDispatch } from 'react-redux';

import { selectProvider } from '../LocationsActions';

import { VACANCY_COLORS } from '../../../shared/Colors';
import IconDetail from '../../../components/premium/styled/IconDetail';
import {
  getValue,
  getAgesServedFromEntity,
  isProviderActive,
  renderFacilityName
} from '../../../utils/DataUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { LABELS, FACILITY_TYPE_LABELS } from '../../../utils/constants/Labels';

const { NEUTRAL, PURPLE } = Colors;

const ActionBar = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: space-between;


  strong {
    color: ${(props) => (props.isInactive ? NEUTRAL.N500 : NEUTRAL.N700)};
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
  color: ${PURPLE.P300};
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
  font-size: 14px;
  line-height: 17px;

  color: ${(props) => props.color};
`;

type Props = {
  coordinates :[number, number];
  isOpen :boolean;
  provider :Map;
  onClose :() => void;
  renderText :(labels :Object) => string;
};

const ProviderPopup = ({
  coordinates,
  isOpen,
  onClose,
  provider,
  renderText
} :Props) => {
  const name = renderFacilityName(provider, renderText);
  const type = provider.get(PROPERTY_TYPES.FACILITY_TYPE, List())
    .map((v) => renderText(FACILITY_TYPE_LABELS[v]));

  const city = getValue(provider, PROPERTY_TYPES.CITY);

  const hasVacancies = getValue(provider, PROPERTY_TYPES.VACANCIES);
  let vacancyLabel = LABELS.AVAILABILITY_UNKNOWN;
  let vacancyColor = VACANCY_COLORS.UNKNOWN;
  if (hasVacancies !== '') {
    vacancyLabel = hasVacancies ? LABELS.SPOTS_OPEN : LABELS.BOOKED;
    vacancyColor = hasVacancies ? VACANCY_COLORS.OPEN : VACANCY_COLORS.CLOSED;
  }

  const ages = getAgesServedFromEntity(provider, renderText);

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
            {renderText(vacancyLabel)}
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
      {isInactive
        ? <IconDetail content={renderText(LABELS.CLOSED_DURING_COVID)} isInactive={isInactive} />
        : null}
      <LinkButton onClick={handleViewProfile}>{renderText(LABELS.VIEW_PROVIDER)}</LinkButton>
    </Popup>
  );
};

export default ProviderPopup;
