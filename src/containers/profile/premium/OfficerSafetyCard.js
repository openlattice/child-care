// @flow
import React, { useMemo } from 'react';

import styled from 'styled-components';
import { faExclamationTriangle } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { List, Map } from 'immutable';
import {
  Card,
  CardHeader,
  CardSegment
} from 'lattice-ui-kit';
import { withRouter } from 'react-router-dom';
import type { Match } from 'react-router-dom';

import BehaviorItem from './BehaviorItem';
import Triggers from './Triggers';
import { countSafetyIncidents } from './Utils';

import EditLinkButton from '../../../components/buttons/EditLinkButton';
import NewIssueButton from '../../../components/buttons/CreateIssueButton';
import OfficerSafetyConcernsList from '../../../components/premium/officersafety/OfficerSafetyConcernsList';
import {
  DashedList,
  H1,
  HeaderActions,
  IconWrapper,
} from '../../../components/layout';
import { CardSkeleton } from '../../../components/skeletons';
import { EDIT_PATH, OFFICER_SAFETY_PATH } from '../../../core/router/Routes';
import { CATEGORIES } from '../../issues/issue/constants';

const { OFFICER_SAFETY } = CATEGORIES;

const StyledCardSegment = styled(CardSegment)`
  min-height: 100px;
  min-width: 300px;
`;

type Props = {
  isLoading ?:boolean;
  match :Match;
  officerSafety :List<Map>;
  reports :List<Map>;
  showEdit :boolean;
  triggers :List<Map>;
};

const OfficerSafetyCard = (props :Props) => {

  const {
    isLoading,
    match,
    officerSafety,
    reports,
    showEdit,
    triggers,
  } = props;

  const safetyIncidentCounts = useMemo(() => countSafetyIncidents(reports), [reports]);
  const total = reports.count();

  if (isLoading) {
    return <CardSkeleton />;
  }

  return (
    <Card>
      <CardHeader mode="warning" padding="sm">
        <H1>
          <IconWrapper>
            <FontAwesomeIcon icon={faExclamationTriangle} fixedWidth />
          </IconWrapper>
          { OFFICER_SAFETY }
          <HeaderActions>
            { showEdit && <EditLinkButton mode="subtle" to={`${match.url}${EDIT_PATH}${OFFICER_SAFETY_PATH}`} /> }
            <NewIssueButton
                defaultComponent={OFFICER_SAFETY}
                mode="subtle" />
          </HeaderActions>
        </H1>
      </CardHeader>
      <StyledCardSegment padding="sm" vertical>
        <OfficerSafetyConcernsList isLoading={isLoading} officerSafety={officerSafety} />
        <DashedList isLoading={isLoading}>
          {
            safetyIncidentCounts.map(([name, count]) => (
              <BehaviorItem
                  key={name}
                  name={name}
                  count={count}
                  total={total} />
            ))
          }
        </DashedList>
      </StyledCardSegment>
      <StyledCardSegment vertical padding="sm">
        <Triggers triggers={triggers} isLoading={isLoading} />
      </StyledCardSegment>
    </Card>
  );
};

OfficerSafetyCard.defaultProps = {
  isLoading: false
};

export default withRouter(OfficerSafetyCard);
