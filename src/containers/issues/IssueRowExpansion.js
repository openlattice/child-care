// @flow
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router';
import { Map } from 'immutable';
import {
  Colors,
  Spinner
} from 'lattice-ui-kit';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import IssueDetails from './IssueDetails';
import { useAuthorization } from '../../components/hooks';
import { getAuthorization } from '../../core/sagas/authorize/AuthorizeActions';

const { NEUTRALS } = Colors;

const RowDetailsWrapper = styled.tr`
  outline: none;
  border-bottom: 1px solid ${NEUTRALS[4]};
`;

const ExpandedCell = styled.td.attrs(() => ({
  colSpan: 5
}))`
  padding: 10px 10px 20px;
  outline: none;
`;

const ExpandedCellContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  min-height: 230px;
  overflow-wrap: break-word;
`;

const IssueRowExpansion = () => {

  const dispatch = useDispatch();

  const authorize = useCallback(() => dispatch(getAuthorization()), [dispatch]);
  const [authorized, isAuthorizing] = useAuthorization('profile', authorize);

  const match = useRouteMatch();

  const fetchState :RequestState = useSelector((store :Map) => store.getIn(['issues', 'issue', 'fetchState']));
  const assignee = useSelector((store :Map) => store.getIn(['issues', 'issue', 'data', 'assignee']));
  const issue = useSelector((store :Map) => store.getIn(['issues', 'issue', 'data', 'issue']));
  const reporter = useSelector((store :Map) => store.getIn(['issues', 'issue', 'data', 'reporter']));
  const subject = useSelector((store :Map) => store.getIn(['issues', 'issue', 'data', 'subject']));

  return (
    <RowDetailsWrapper>
      <ExpandedCell>
        {
          ((fetchState === RequestStates.PENDING) || isAuthorizing)
            ? (
              <ExpandedCellContent>
                <Spinner size="2x" />
              </ExpandedCellContent>
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
      </ExpandedCell>
    </RowDetailsWrapper>
  );
};

export default IssueRowExpansion;
