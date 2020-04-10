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
import { getDistanceBetweenCoords, getValue, getValues, getAgesServedFromEntity } from '../../utils/DataUtils';
import { getDobFromPerson, getLastFirstMiFromPerson } from '../../utils/PersonUtils';
import { PROPERTY_TYPES } from '../../utils/constants/DataModelConstants';
import { LABELS } from '../../utils/constants/Labels';
import { selectProvider } from '../location/providers/LocationsActions';
import { getBoundsFromPointsOfInterest, getCoordinates } from '../map/MapUtils';
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
  const type = getValues(provider, PROPERTY_TYPES.FACILITY_TYPE);

  const city = getValue(provider, PROPERTY_TYPES.CITY);

  const isOpen = getValue(provider, PROPERTY_TYPES.STATUS) === FACILITY_STATUSES.OPEN;

  const ages = getAgesServedFromEntity(provider, renderText);

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
                <IconDetail content={ages} />
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
