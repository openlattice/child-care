// @flow

import React, { useMemo } from 'react';

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
import { getValue, getValues } from '../../utils/DataUtils';
import { PROPERTY_TYPES } from '../../utils/constants/DataModelConstants';
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

const LongBeachResult = ({
  provider,
} :Props) => {
  const providerEKID = provider.getIn([OPENLATTICE_ID_FQN, 0]);
  const goToProfile = useGoToPath(PROFILE_VIEW_PATH.replace(PROFILE_ID_PATH, providerEKID));
  const dispatch = useDispatch();

  const handleViewProfile = () => {
    dispatch(selectProvider(provider));
  };

  const name = getValue(provider, PROPERTY_TYPES.FACILITY_NAME);
  const type = getValues(provider, PROPERTY_TYPES.FACILITY_TYPE);
  const status = getValues(provider, PROPERTY_TYPES.STATUS);
  const url = getValue(provider, PROPERTY_TYPES.URL);

  const street = getValue(provider, PROPERTY_TYPES.ADDRESS);
  const city = getValue(provider, PROPERTY_TYPES.CITY);
  const zip = getValue(provider, PROPERTY_TYPES.ZIP);

  const address = [street, city, zip].filter(v => v).join(', ');

  return (
    <Card onClick={handleViewProfile}>
      <ResultSegment padding="sm" vertical>
        <ResultName bold uppercase>{name}</ResultName>
        <FlexRow>
          <ResultDetails>
            <IconDetail content={type} />
            <IconDetail content={status} />
            <IconDetail content={url} />
            <IconDetail content={address} />
          </ResultDetails>
        </FlexRow>
      </ResultSegment>
    </Card>
  );
};

export default LongBeachResult;
