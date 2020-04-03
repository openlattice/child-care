// @flow

import React from 'react';

import { faHistory, faUsers } from '@fortawesome/pro-solid-svg-icons';
import { Map } from 'immutable';
import { Card, StepIcon } from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import { useSelector } from 'react-redux';

import { ENCAMPMENT_STORE_PATH } from './constants';

import IconDetail from '../../../components/premium/styled/IconDetail';
import {
  DESCRIPTION_FQN,
  ENTRY_UPDATED_FQN,
  LOCATION_COORDINATES_FQN,
  NUMBER_OF_PEOPLE_FQN,
} from '../../../edm/DataModelFqns';
import { getCoordinates } from '../../map/MapUtils';
import { ResultSegment } from '../../styled';

type Props = {
  result :Map;
  index :number;
}

const EncampmentResult = (props :Props) => {

  const { index, result: locationEKID } = props;

  const encampmentLocation = useSelector((store) => store.getIn([...ENCAMPMENT_STORE_PATH, 'encampmentLocations', locationEKID]));
  const encampment = useSelector((store) => store.getIn([...ENCAMPMENT_STORE_PATH, 'encampments', locationEKID])) || Map();
  const occupants = encampment.getIn([NUMBER_OF_PEOPLE_FQN, 0]);
  const description = encampment.getIn([DESCRIPTION_FQN, 0]);
  const rawUpdated = encampment.getIn([ENTRY_UPDATED_FQN, 0]);

  const coordinates = getCoordinates(encampmentLocation);
  const lastUpdated = DateTime.fromISO(rawUpdated).toLocaleString(DateTime.DATETIME_SHORT);

  return (
    <Card>
      <ResultSegment vertical padding="sm">
        <StepIcon active index={index + 1} />
        <IconDetail content={occupants} icon={faUsers} />
        <IconDetail content={lastUpdated} icon={faHistory} />
        <IconDetail content={description} />
      </ResultSegment>
    </Card>
  );
};

export default React.memo<Props>(EncampmentResult);
