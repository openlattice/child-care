// @flow
import React from 'react';

import { faBullhorn } from '@fortawesome/pro-solid-svg-icons';
import {
  Banner,
  Card,
} from 'lattice-ui-kit';

type Props = {
  count :number;
  isLoading ?:boolean;
};

const RecentIncidentCard = (props :Props) => {

  const { count, isLoading } = props;

  if (!count || isLoading) return null;

  return (
    <Card>
      <Banner
          isOpen
          icon={faBullhorn}>
        <span>
          {`${count} incident(s) within the last 7 days.`}
        </span>
      </Banner>
    </Card>
  );
};

RecentIncidentCard.defaultProps = {
  isLoading: false
};

export default RecentIncidentCard;
