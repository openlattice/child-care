import React from 'react';

import styled from 'styled-components';
import {
  Card,
  CardHeader,
  CardSegment,
  Skeleton
} from 'lattice-ui-kit';

const IntroGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 5px;

  > span:nth-child(-n + 2),
  > span:last-child {
    grid-column: auto / span 2;
  }
`;

const IntroCardSkeleton = () => (
  <Card>
    <CardHeader padding="sm">
      <Skeleton height={27} width="40%" />
    </CardHeader>
    <CardSegment vertical padding="sm">
      <Skeleton height={27} width="80%" />
      <Skeleton width="40%" />
    </CardSegment>
    <CardSegment vertical padding="sm">
      <Skeleton width="50%" />
    </CardSegment>
    <CardSegment vertical padding="sm">
      <IntroGrid>
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
        <Skeleton />
      </IntroGrid>
    </CardSegment>
  </Card>
);

export default IntroCardSkeleton;
