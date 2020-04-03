import React from 'react';

import {
  Card,
  CardHeader,
  CardSegment,
  Skeleton
} from 'lattice-ui-kit';

const CardSkeleton = () => (
  <Card>
    <CardHeader padding="sm">
      <Skeleton height={27} width="40%" />
    </CardHeader>
    <CardSegment vertical padding="sm">
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </CardSegment>
  </Card>
);

export default CardSkeleton;
