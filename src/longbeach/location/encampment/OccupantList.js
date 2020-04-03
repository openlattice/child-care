// @flow
import React from 'react';

import { faUserSlash } from '@fortawesome/pro-solid-svg-icons';
import {
  Card,
  CardSegment,
  IconSplash,
  Spinner,
} from 'lattice-ui-kit';
import { useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import OccupantItem from './OccupantItem';
import { ENCAMPMENT_STORE_PATH } from './constants';

const OccupantList = () => {
  const livesAt = useSelector((store) => store.getIn([...ENCAMPMENT_STORE_PATH, 'occupation', 'livesAt']));
  const people = useSelector((store) => store.getIn([...ENCAMPMENT_STORE_PATH, 'occupation', 'people']));
  const fetchState = useSelector((store) => store.getIn([...ENCAMPMENT_STORE_PATH, 'occupation', 'fetchState']));

  const isLoading = fetchState === RequestStates.PENDING;

  if (isLoading) {
    return (
      <Card>
        <CardSegment vertical>
          <Spinner size="3x" />
        </CardSegment>
      </Card>
    );
  }

  if (!livesAt.count()) {
    return <IconSplash icon={faUserSlash} caption="No documented occupants." />;
  }

  return (
    <Card>
      {
        livesAt.toJS().map((edge) => {
          const person = people.get(edge);
          return <OccupantItem key={edge} person={person} livesAtEKID={edge} />;
        })
      }
    </Card>
  );

};

export default OccupantList;
