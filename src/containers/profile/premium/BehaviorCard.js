// @flow
import React from 'react';

import styled from 'styled-components';
import { faHeadSideBrain } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import {
  Card,
  CardHeader,
  CardSegment,
} from 'lattice-ui-kit';

import BehaviorItem from './BehaviorItem';

import { DashedList, H1, IconWrapper } from '../../../components/layout';
import { CardSkeleton } from '../../../components/skeletons';

const StyledCardSegment = styled(CardSegment)`
  min-width: 300px;
`;

type Props = {
  behaviorSummary :Map;
  isLoading ? :boolean;
};

const BehaviorCard = (props :Props) => {

  const { isLoading, behaviorSummary } = props;

  if (isLoading) {
    return <CardSkeleton />;
  }

  return (
    <Card>
      <CardHeader mode="primary" padding="sm">
        <H1>
          <IconWrapper>
            <FontAwesomeIcon icon={faHeadSideBrain} fixedWidth />
          </IconWrapper>
          Behaviors
        </H1>
      </CardHeader>
      <StyledCardSegment padding="sm">
        <DashedList>
          {
            behaviorSummary
              .sortBy((count) => -count)
              .toKeyedSeq()
              .toArray()
              .map(([name, count]) => (
                <BehaviorItem
                    key={name}
                    name={name}
                    count={count} />
              ))
          }
        </DashedList>
      </StyledCardSegment>
    </Card>
  );
};

BehaviorCard.defaultProps = {
  isLoading: false,
};

export default BehaviorCard;
