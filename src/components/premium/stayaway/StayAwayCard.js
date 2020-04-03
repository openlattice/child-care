// @flow
import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Card,
  CardHeader,
  CardSegment,
  Label,
} from 'lattice-ui-kit';

import IconDetail from '../styled/IconDetail';
import { getAddressFromLocation } from '../../../utils/AddressUtils';
import { H1 } from '../../layout';
import { CardSkeleton } from '../../skeletons';

const Grid = styled.div`
  display: grid;
  grid-gap: 10px;
`;

type Props = {
  isLoading :boolean;
  stayAwayLocation :Map;
};

const StayAwayCard = ({ isLoading, stayAwayLocation } :Props) => {

  const { name, address } = getAddressFromLocation(stayAwayLocation);

  if (isLoading) return <CardSkeleton />;

  return (
    <Card>
      <CardHeader mode="primary" padding="sm">
        <H1>Stay Away Order</H1>
      </CardHeader>
      <CardSegment padding="sm">
        <Grid>
          <div>
            <Label subtle>
              Location Name
            </Label>
            <IconDetail content={name} isLoading={isLoading} />
          </div>
          <div>
            <Label subtle>
              Location
            </Label>
            <IconDetail content={address} isLoading={isLoading} />
          </div>
        </Grid>
      </CardSegment>
    </Card>
  );
};

export default StayAwayCard;
