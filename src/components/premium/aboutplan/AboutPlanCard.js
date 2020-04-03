// @flow
import React from 'react';

import { faInfoSquare } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import {
  Card,
  CardHeader,
  CardSegment,
  Label
} from 'lattice-ui-kit';
import { useRouteMatch } from 'react-router';

import EditLinkButton from '../../buttons/EditLinkButton';
import IconDetail from '../styled/IconDetail';
import NewIssueButton from '../../buttons/CreateIssueButton';
import { CATEGORIES } from '../../../containers/issues/issue/constants';
import { ABOUT_PATH, EDIT_PATH } from '../../../core/router/Routes';
import { PERSON_ID_FQN } from '../../../edm/DataModelFqns';
import { H1, HeaderActions, IconWrapper } from '../../layout';
import { CardSkeleton } from '../../skeletons';

const { ABOUT } = CATEGORIES;

type Props = {
  isLoading ?:boolean;
  responsibleUser :Map;
  showEdit :boolean;
}

const AboutPlanCard = (props :Props) => {
  const match = useRouteMatch();
  const { isLoading, responsibleUser, showEdit } = props;

  if (isLoading) {
    return <CardSkeleton />;
  }

  const content = responsibleUser.getIn([PERSON_ID_FQN, 0]) || '---';
  return (
    <Card>
      <CardHeader mode="default" padding="sm">
        <H1>
          <IconWrapper>
            <FontAwesomeIcon icon={faInfoSquare} fixedWidth />
          </IconWrapper>
          About Plan
          <HeaderActions>
            { showEdit && <EditLinkButton mode="subtle" to={`${match.url}${EDIT_PATH}${ABOUT_PATH}`} /> }
            <NewIssueButton defaultComponent={ABOUT} mode="subtle" />
          </HeaderActions>
        </H1>
      </CardHeader>
      <CardSegment vertical padding="sm">
        <Label subtle>Assigned Officer</Label>
        <IconDetail isLoading={isLoading} content={content} />
      </CardSegment>
    </Card>
  );
};

AboutPlanCard.defaultProps = {
  isLoading: false,
};

export default AboutPlanCard;
