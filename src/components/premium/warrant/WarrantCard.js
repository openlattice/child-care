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
import * as FQN from '../../../edm/DataModelFqns';
import { H1 } from '../../layout';
import { CardSkeleton } from '../../skeletons';

const Grid = styled.div`
  display: grid;
  grid-gap: 10px;
`;

type Props = {
  isLoading :boolean;
  warrant :Map;
};

const WarrantCard = ({ isLoading, warrant } :Props) => {

  const warrantNumber = warrant.getIn([FQN.WARRANT_NUMBER_FQN, 0]);

  if (isLoading) return <CardSkeleton />;

  return (
    <Card>
      <CardHeader mode="primary" padding="sm">
        <H1>Warrant</H1>
      </CardHeader>
      <CardSegment padding="sm">
        <Grid>
          <div>
            <Label subtle>
              Warrant #
            </Label>
            <IconDetail content={warrantNumber} isLoading={isLoading} />
          </div>
        </Grid>
      </CardSegment>
    </Card>
  );
};

export default WarrantCard;
