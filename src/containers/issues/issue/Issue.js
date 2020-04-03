// @flow
import React, { useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import {
  Card,
  CardSegment,
  CardStack,
  Spinner
} from 'lattice-ui-kit';
import { Map } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/pro-regular-svg-icons';
import type { RequestState } from 'redux-reqseq';

import IssueDetails from '../IssueDetails';
import LinkButton from '../../../components/buttons/LinkButton';
import { resetIssue, selectIssue } from './IssueActions';
import { ISSUES_PATH } from '../../../core/router/Routes';
import { getAuthorization } from '../../../core/sagas/authorize/AuthorizeActions';
import { useAuthorization } from '../../../components/hooks';

const Centered = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  min-height: 230px;
  overflow-wrap: break-word;
`;

const Issue = () => {

  const dispatch = useDispatch();

  const authorize = useCallback(() => dispatch(getAuthorization()), [dispatch]);
  const [authorized, isAuthorizing] = useAuthorization('profile', authorize);

  const match = useRouteMatch();
  const { issueId } = match.params;

  useEffect(() => {
    dispatch(selectIssue({ id: issueId }));

    return () => dispatch(resetIssue());
  }, [dispatch, issueId]);

  const fetchState :RequestState = useSelector((store :Map) => store.getIn(['issues', 'issue', 'fetchState']));
  const assignee = useSelector((store :Map) => store.getIn(['issues', 'issue', 'data', 'assignee']));
  const issue = useSelector((store :Map) => store.getIn(['issues', 'issue', 'data', 'issue']));
  const reporter = useSelector((store :Map) => store.getIn(['issues', 'issue', 'data', 'reporter']));
  const subject = useSelector((store :Map) => store.getIn(['issues', 'issue', 'data', 'subject']));

  return (
    <CardStack>
      <div>
        <LinkButton to={ISSUES_PATH} mode="subtle">
          <FontAwesomeIcon icon={faArrowLeft} fixedWidth />
          Back to Issues
        </LinkButton>
      </div>
      <Card>
        <CardSegment>
          {
            ((fetchState === RequestStates.PENDING) || isAuthorizing)
              ? (
                <Centered>
                  <Spinner size="2x" />
                </Centered>
              )
              : (
                <IssueDetails
                    authorized={authorized}
                    issue={issue}
                    reporter={reporter}
                    subject={subject}
                    assignee={assignee}
                    match={match} />
              )
          }
        </CardSegment>
      </Card>
    </CardStack>
  );
};

export default Issue;
