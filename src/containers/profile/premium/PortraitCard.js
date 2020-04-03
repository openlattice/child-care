// @flow
import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Card,
  CardSegment,
} from 'lattice-ui-kit';

import LabeledDetail from '../../../components/premium/styled/LabeledDetail';
import Portrait from '../../../components/portrait/Portrait';
import * as FQN from '../../../edm/DataModelFqns';
import { getDobFromPerson } from '../../../utils/PersonUtils';

const CenteredSegment = styled(CardSegment)`
  align-items: center;
  border-bottom: 0 !important;
`;

const WordBreakSegment = styled(CardSegment)`
  word-break: break-word;
`;

type Props = {
  imageUrl :string;
  person :Map;
  isLoading :boolean;
};

const PortraitCard = (props :Props) => {
  const { imageUrl, person, isLoading } = props;

  const first = person.getIn([FQN.PERSON_FIRST_NAME_FQN, 0], '');
  const last = person.getIn([FQN.PERSON_LAST_NAME_FQN, 0], '');
  const dob = getDobFromPerson(person);

  return (
    <Card>
      <CenteredSegment vertical>
        <Portrait imageUrl={imageUrl} />
      </CenteredSegment>
      <WordBreakSegment padding="0 0 10px" noBleed vertical>
        <LabeledDetail label="First Name" content={first} isLoading={isLoading} />
      </WordBreakSegment>
      <WordBreakSegment padding="sm" noBleed vertical>
        <LabeledDetail label="Last Name" content={last} isLoading={isLoading} />
      </WordBreakSegment>
      <WordBreakSegment padding="10px 0 30px" noBleed vertical>
        <LabeledDetail label="Date of Birth" content={dob} isLoading={isLoading} />
      </WordBreakSegment>
    </Card>
  );
};

export default PortraitCard;
