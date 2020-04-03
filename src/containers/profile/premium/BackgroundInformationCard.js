// @flow
import React from 'react';

import styled from 'styled-components';
import { faAddressCard } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import {
  Card,
  CardHeader,
  CardSegment,
  IconSplash,
  Spinner
} from 'lattice-ui-kit';
import { withRouter } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import EditLinkButton from '../../../components/buttons/EditLinkButton';
import NewIssueButton from '../../../components/buttons/CreateIssueButton';
import { H1, HeaderActions, IconWrapper } from '../../../components/layout';
import { CardSkeleton } from '../../../components/skeletons';
import { EDIT_PATH, RESPONSE_PLAN_PATH } from '../../../core/router/Routes';
import { CONTEXT_FQN } from '../../../edm/DataModelFqns';
import { isEmptyString, isNonEmptyString } from '../../../utils/LangUtils';
import { CATEGORIES } from '../../issues/issue/constants';

const { RESPONSE_PLAN } = CATEGORIES;

const Text = styled.p`
  white-space: pre-wrap;
  word-break: break-word;
`;

type Props = {
  isLoading ? :boolean;
  backgroundInformation :Map;
  match :Match;
  showEdit :boolean;
};

const BackgroundInformationCard = (props :Props) => {
  const {
    backgroundInformation,
    isLoading,
    match,
    showEdit
  } = props;
  if (isLoading) {
    return <CardSkeleton />;
  }
  const backgroundSummary :string = backgroundInformation.getIn([CONTEXT_FQN, 0]) || '';
  return (
    <Card>
      <CardHeader mode="primary" padding="sm">
        <H1>
          <IconWrapper>
            <FontAwesomeIcon icon={faAddressCard} fixedWidth />
          </IconWrapper>
          Background Information
          <HeaderActions>
            { showEdit && <EditLinkButton mode="primary" to={`${match.url}${EDIT_PATH}${RESPONSE_PLAN_PATH}`} /> }
            <NewIssueButton defaultComponent={RESPONSE_PLAN} mode="primary" />
          </HeaderActions>
        </H1>
      </CardHeader>
      <CardSegment vertical padding="sm">
        { isLoading && <Spinner size="2x" /> }
        { (!isLoading && isNonEmptyString(backgroundSummary)) && <Text>{backgroundSummary}</Text> }
        { (!isLoading && isEmptyString(backgroundSummary)) && <IconSplash caption="No background information." /> }
      </CardSegment>
    </Card>
  );
};

BackgroundInformationCard.defaultProps = {
  isLoading: false
};

export default withRouter(BackgroundInformationCard);
