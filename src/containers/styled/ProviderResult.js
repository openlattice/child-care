// @flow

import React from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import { Card } from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';

import IconDetail from '../../components/premium/styled/IconDetail';

import { PROPERTY_TYPES } from '../../utils/constants/DataModelConstants';
import { LABELS, FACILITY_TYPE_LABELS } from '../../utils/constants/Labels';
import { OpenClosedTag } from '../../components/layout';
import { VACANCY_COLORS } from '../../shared/Colors';
import {
  getAgesServedFromEntity,
  getDistanceBetweenCoords,
  getValue,
  isProviderActive,
  renderFacilityName
} from '../../utils/DataUtils';
import { selectProvider } from '../location/LocationsActions';
import { getCoordinates } from '../map/MapUtils';
import type { Translation } from '../../types';
import {
  FlexRow,
  ResultDetails,
  ResultName,
  ResultSegment,
} from '.';

type Props = {
  provider :Map;
  coordinates :number[],
  getText :(translation :Translation) => string;
}

const TwoPartRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const CardContent = styled.div`
  padding: 5px 0;
`;

const ProviderResult = ({
  provider,
  coordinates,
  getText
} :Props) => {
  const dispatch = useDispatch();

  const handleViewProfile = () => {
    dispatch(selectProvider(provider));
  };

  const [lon, lat] = getCoordinates(provider);
  const miles = getDistanceBetweenCoords(coordinates, [lat, lon]);
  const distance = Math.round(miles * 10) / 10;

  const name = renderFacilityName(provider, getText);
  const type = provider.get(PROPERTY_TYPES.FACILITY_TYPE, List())
    .map((v) => getText(FACILITY_TYPE_LABELS[v]));

  const city = getValue(provider, PROPERTY_TYPES.CITY);

  const isInactive = !isProviderActive(provider);

  const ages = getAgesServedFromEntity(provider, getText);

  const hasVacancies = getValue(provider, PROPERTY_TYPES.VACANCIES);

  let vacancyLabel = LABELS.AVAILABILITY_UNKNOWN;
  let vacancyColor = VACANCY_COLORS.UNKNOWN;
  if (hasVacancies !== '') {
    vacancyLabel = hasVacancies ? LABELS.SPOTS_OPEN : LABELS.BOOKED;
    vacancyColor = hasVacancies ? VACANCY_COLORS.OPEN : VACANCY_COLORS.CLOSED;
  }

  return (
    <Card onClick={handleViewProfile}>
      <CardContent>
        <ResultSegment padding="sm" vertical>
          <TwoPartRow>
            <ResultName isInactive={isInactive} bold uppercase>{name}</ResultName>
            <IconDetail content={`${distance} mi`} isInactive={isInactive} fitContent />
          </TwoPartRow>
          <FlexRow>
            <ResultDetails>

              <IconDetail content={type} isInactive={isInactive} />

              <IconDetail content={`${city}, CA`} isInactive={isInactive} />

              <IconDetail content={ages} isInactive={isInactive} />

              {isInactive
                ? <IconDetail content={getText(LABELS.CLOSED_DURING_COVID)} isInactive={isInactive} />
                : null}

            </ResultDetails>
          </FlexRow>
          {
            !isInactive && (
              <OpenClosedTag color={vacancyColor}>
                {getText(vacancyLabel)}
              </OpenClosedTag>
            )
          }
        </ResultSegment>

      </CardContent>
    </Card>
  );
};

export default ProviderResult;
