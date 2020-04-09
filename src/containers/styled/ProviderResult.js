// @flow

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { Map } from 'immutable';
import { Card } from 'lattice-ui-kit';
import { useDispatch } from 'react-redux';

import IconDetail from '../../components/premium/styled/IconDetail';
import { useGoToPath } from '../../components/hooks';
import {
  PROFILE_ID_PATH,
  PROFILE_VIEW_PATH,
} from '../../core/router/Routes';
import {
  OPENLATTICE_ID_FQN,
  PERSON_RACE_FQN,
  PERSON_SEX_FQN
} from '../../edm/DataModelFqns';
import { getAddressFromLocation } from '../../utils/AddressUtils';
import { getImageDataFromEntity } from '../../utils/BinaryUtils';
import { getValue, getValues, getDistanceBetweenCoords } from '../../utils/DataUtils';
import { getBoundsFromPointsOfInterest, getCoordinates } from '../map/MapUtils';
import { FACILITY_STATUSES } from '../../utils/DataConstants';
import { PROPERTY_TYPES } from '../../utils/constants/DataModelConstants';
import { LABELS } from '../../utils/constants/Labels';
import { getDobFromPerson, getLastFirstMiFromPerson } from '../../utils/PersonUtils';
import { selectProvider } from '../location/providers/LocationsActions';

import {
  FlexRow,
  ResultDetails,
  ResultName,
  ResultSegment,
} from '.';

type Props = {
  person :Map;
  stayAwayLocation :Map;
  profilePicture :Map;
}

const TwoPartRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const CardContent = styled.div`
  padding: 5px 0;
`;

const OpenClosedTag = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;

  text-align: right;
  color: ${(props) => (props.isOpen ? '#009D48' : '#C61F08')};
`;

const ProviderResult = ({
  provider,
  coordinates,
  renderText
} :Props) => {
  const providerEKID = provider.getIn([OPENLATTICE_ID_FQN, 0]);
  const dispatch = useDispatch();

  const handleViewProfile = () => {
    dispatch(selectProvider(provider));
  };

  const [lon, lat] = getCoordinates(provider);
  const miles = getDistanceBetweenCoords(coordinates, [lat, lon]);
  const distance = Math.round(miles * 10) / 10;

  const name = getValue(provider, PROPERTY_TYPES.FACILITY_NAME);
  const type = getValues(provider, PROPERTY_TYPES.FACILITY_TYPE);

  const city = getValue(provider, PROPERTY_TYPES.CITY);

  const isOpen = getValue(provider, PROPERTY_TYPES.STATUS) === FACILITY_STATUSES.OPEN;

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

  return (
    <Card onClick={handleViewProfile}>
      <CardContent>
        <ResultSegment padding="sm" vertical>
          <TwoPartRow>
            <ResultName bold uppercase>{name}</ResultName>
            <OpenClosedTag isOpen={isOpen}>
              {renderText(isOpen ? LABELS.OPEN : LABELS.CLOSED)}
            </OpenClosedTag>
          </TwoPartRow>
          <FlexRow>
            <ResultDetails>

              <IconDetail content={type} />

              <IconDetail content={`${city}, CA`} />

              <TwoPartRow>
                <IconDetail content={capacities.join(', ')} />
                <IconDetail content={`${distance} mi`} />
              </TwoPartRow>

            </ResultDetails>
          </FlexRow>
        </ResultSegment>

      </CardContent>
    </Card>
  );
};

export default ProviderResult;
