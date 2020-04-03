// @flow
import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Card,
  CardHeader,
  CardSegment,
  Label,
  Tag
} from 'lattice-ui-kit';

import IconDetail from '../styled/IconDetail';
import * as FQN from '../../../edm/DataModelFqns';
import { getDateShortFromIsoDate, isNowValid } from '../../../utils/DateUtils';
import { H1 } from '../../layout';
import { CardSkeleton } from '../../skeletons';

const Grid = styled.div`
  display: grid;
  grid-gap: 10px;
`;

type Props = {
  isLoading :boolean;
  probation :Map;
};

const ProbationCard = ({ isLoading, probation } :Props) => {

  const startDT = probation.getIn([FQN.RECOGNIZED_START_DATE_FQN, 0]);
  const endDT = probation.getIn([FQN.RECOGNIZED_END_DATE_FQN, 0]);
  const probationStart :string = getDateShortFromIsoDate(startDT);
  const probationEnd :string = getDateShortFromIsoDate(endDT);
  const isActive = isNowValid(startDT, endDT);
  const probationStatus = isActive ? 'Active' : 'Inactive';
  const probationTag = <Tag mode={isActive ? 'danger' : 'default'}>{probationStatus}</Tag>;

  if (isLoading) return <CardSkeleton />;

  return (
    <Card>
      <CardHeader mode="primary" padding="sm">
        <H1>Probation</H1>
      </CardHeader>
      <CardSegment padding="sm">
        <Grid>
          <div>
            <Label subtle>
              Status
            </Label>
            <IconDetail content={probationTag} isLoading={isLoading} />
          </div>
          <div>
            <Label subtle>
              Period
            </Label>
            <IconDetail content={`${probationStart} - ${probationEnd}`} isLoading={isLoading} />
          </div>
        </Grid>
      </CardSegment>
    </Card>
  );
};

export default ProbationCard;
