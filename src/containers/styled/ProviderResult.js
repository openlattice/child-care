// @flow

import React, { useMemo } from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
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
import { FACILITY_STATUSES } from '../../utils/DataConstants';
import { getDobFromPerson, getLastFirstMiFromPerson } from '../../utils/PersonUtils';
import { PROPERTY_TYPES } from '../../utils/constants/DataModelConstants';
import { LABELS, FACILITY_TYPE_LABELS } from '../../utils/constants/Labels';
import { selectProvider } from '../location/providers/LocationsActions';
import { getBoundsFromPointsOfInterest, getCoordinates } from '../map/MapUtils';
import {
  getDistanceBetweenCoords,
  getValue,
  getValues,
  getAgesServedFromEntity,
  isProviderActive
} from '../../utils/DataUtils';
import {
  FlexRow,
  ResultDetails,
  ResultName,
  ResultSegment,
} from '.';

type Props = {
  person :Map;
  provider :Map;
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
  const type = provider.get(PROPERTY_TYPES.FACILITY_TYPE, List())
    .map(v => renderText(FACILITY_TYPE_LABELS[v]));

  const city = getValue(provider, PROPERTY_TYPES.CITY);

  const isInactive = !isProviderActive(provider);

  const ages = getAgesServedFromEntity(provider, renderText);

  const openStatus = (
    <OpenClosedTag isOpen={!isInactive}>
      {renderText(isInactive ? LABELS.CLOSED : LABELS.OPEN)}
    </OpenClosedTag>
  );

  return (
    <Card onClick={handleViewProfile}>
      <CardContent>
        <ResultSegment padding="sm" vertical>
          <TwoPartRow>
            <ResultName isInactive={isInactive} bold uppercase>{name}</ResultName>
            <IconDetail content={`${distance} mi`} isInactive={isInactive} />
          </TwoPartRow>
          <FlexRow>
            <ResultDetails>

              <IconDetail content={type} isInactive={isInactive} />

              <IconDetail content={`${city}, CA`} isInactive={isInactive} />

              <IconDetail content={ages} isInactive={isInactive} />

              {isInactive
                ? <IconDetail content={renderText(LABELS.CLOSED_DURING_COVID)} isInactive={isInactive} />
                : null}

            </ResultDetails>
          </FlexRow>
        </ResultSegment>

      </CardContent>
    </Card>
  );
};

export default ProviderResult;
