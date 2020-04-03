// @flow

import React from 'react';

import styled from 'styled-components';
import { faUserHardHat } from '@fortawesome/pro-regular-svg-icons';
import {
  faClawMarks,
  faEye,
  faRulerVertical,
  faUser,
  faVenusMars,
  faWeightHanging
} from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import {
  Card,
  CardHeader,
  CardSegment,
  Label,
} from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import { withRouter } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import EditLinkButton from '../../../components/buttons/EditLinkButton';
import IconDetail from '../../../components/premium/styled/IconDetail';
import NewIssueButton from '../../../components/buttons/CreateIssueButton';
import * as FQN from '../../../edm/DataModelFqns';
import { H1, HeaderActions, IconWrapper } from '../../../components/layout';
import { IntroCardSkeleton } from '../../../components/skeletons';
import { BASIC_PATH, EDIT_PATH } from '../../../core/router/Routes';
import { inchesToFeetString } from '../../../utils/DataUtils';
import { getLastFirstMiFromPerson } from '../../../utils/PersonUtils';
import { CATEGORIES } from '../../issues/issue/constants';

const { BASIC_INFORMATION } = CATEGORIES;

const Name = styled(IconDetail)`
  text-transform: uppercase;
  font-weight: 600;
`;

const Birthdate = styled(IconDetail)`
  width: 50%;
`;

const IntroGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 5px;

  > div:nth-child(-n + 2),
  > div:last-child {
    grid-column: auto / span 2;
  }
`;

type Props = {
  appearance :Map;
  isLoading :boolean;
  match :Match;
  scars :Map;
  selectedPerson :Map;
  showEdit :boolean;
};

const IntroCard = (props :Props) => {

  const {
    appearance,
    isLoading,
    match,
    scars,
    selectedPerson,
    showEdit,
  } = props;

  if (isLoading) {
    return <IntroCardSkeleton />;
  }

  const formattedName = getLastFirstMiFromPerson(selectedPerson, true);

  const rawDob = selectedPerson.getIn([FQN.PERSON_DOB_FQN, 0], '');
  const race = selectedPerson.getIn([FQN.PERSON_RACE_FQN, 0], '');
  const sex = selectedPerson.getIn([FQN.PERSON_SEX_FQN, 0], '');
  const aliases = selectedPerson.get(FQN.PERSON_NICK_NAME_FQN, []).join(', ');
  let formattedDob = '';

  if (rawDob) {
    formattedDob = DateTime.fromISO(rawDob).toLocaleString(DateTime.DATE_SHORT);
  }

  const scarsMarksTattoos = scars.getIn([FQN.DESCRIPTION_FQN], '');

  const hairColor = appearance.getIn([FQN.HAIR_COLOR_FQN, 0], '');
  const eyeColor = appearance.getIn([FQN.EYE_COLOR_FQN, 0], '');
  const height = appearance.getIn([FQN.HEIGHT_FQN, 0]);
  const weight = appearance.getIn([FQN.WEIGHT_FQN, 0]);

  const formattedHeight = height ? inchesToFeetString(height) : '';
  const formattedWeight = weight ? `${weight} lbs` : '';

  return (
    <Card>
      <CardHeader mode="primary" padding="sm">
        <H1>
          <IconWrapper>
            <FontAwesomeIcon icon={faUser} fixedWidth />
          </IconWrapper>
          Intro
          <HeaderActions>
            { showEdit && <EditLinkButton mode="primary" to={`${match.url}${EDIT_PATH}${BASIC_PATH}`} /> }
            <NewIssueButton defaultComponent={BASIC_INFORMATION} mode="primary" />
          </HeaderActions>
        </H1>
      </CardHeader>
      <CardSegment vertical padding="sm">
        <Name content={formattedName} isLoading={isLoading} />
        <Birthdate content={formattedDob} isLoading={isLoading} />
      </CardSegment>
      <CardSegment vertical padding="sm">
        <Label subtle>Aliases</Label>
        <IconDetail
            content={aliases}
            isLoading={isLoading} />
      </CardSegment>
      <CardSegment vertical padding="sm">
        <IntroGrid>
          <IconDetail
              content={race}
              isLoading={isLoading}
              icon={faUser} />
          <IconDetail
              content={sex}
              isLoading={isLoading}
              icon={faVenusMars} />
          <IconDetail
              content={formattedHeight}
              isLoading={isLoading}
              icon={faRulerVertical} />
          <IconDetail
              content={formattedWeight}
              isLoading={isLoading}
              icon={faWeightHanging} />
          <IconDetail
              content={hairColor}
              isLoading={isLoading}
              icon={faUserHardHat} />
          <IconDetail
              content={eyeColor}
              isLoading={isLoading}
              icon={faEye} />
          <IconDetail
              content={scarsMarksTattoos}
              isLoading={isLoading}
              icon={faClawMarks} />
        </IntroGrid>
      </CardSegment>
    </Card>
  );
};

IntroCard.defaultProps = {
  isLoading: false,
};

export default withRouter(IntroCard);
