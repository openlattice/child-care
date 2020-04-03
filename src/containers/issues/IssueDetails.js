// @flow
import React, { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { Map, getIn } from 'immutable';
import { Button, Label, Hooks } from 'lattice-ui-kit';
import { RequestStates } from 'redux-reqseq';
import type { Match } from 'react-router';

import LinkButton from '../../components/buttons/LinkButton';
import IssueModal from './issue/IssueModal';
import DropdownButton from '../../components/buttons/DropdownButton';
import { setIssueStatus } from './issue/IssueActions';
import { getJumpToActionPath, getIssueUrl } from './issue/IssueUtils';
import { getLastFirstMiFromPerson } from '../../utils/PersonUtils';
import {
  TITLE_FQN,
  PRIORITY_FQN,
  STATUS_FQN,
  CATEGORY_FQN,
  DESCRIPTION_FQN,
  PERSON_ID_FQN,
  OPENLATTICE_ID_FQN,
} from '../../edm/DataModelFqns';
import { STATUS_VALUES } from './issue/constants';

const { useBoolean } = Hooks;

const ButtonGroup = styled.div`
  > :not(:first-child) {
    margin-left: 10px;
  }
`;

const IssueDetailsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  min-height: 200px;
  overflow-wrap: break-word;
`;

const Title = styled.div`
  font-size: 18px;
  font-weight: 600;
  width: 100%;
`;

const LabelGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 10px 0;
`;

const LabelGroup = styled.div`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type Props = {
  assignee :Map;
  authorized :boolean;
  hideTitle :boolean;
  issue :Map;
  match :Match;
  reporter :Map;
  subject :Map;
};

const IssueDetails = (props :Props) => {
  const {
    assignee,
    authorized,
    hideTitle,
    issue,
    match,
    reporter,
    subject,
  } = props;

  const [isVisible, open, close] = useBoolean();
  const [hasCopied, copy] = useBoolean();
  const dispatch = useDispatch();
  const isLoading = useSelector((store :Map) => store
    .getIn(['issues', 'issue', 'updateState']) === RequestStates.PENDING);

  const assigneeName = getIn(assignee, [PERSON_ID_FQN, 0]);
  const category = getIn(issue, [CATEGORY_FQN, 0]);
  const description = getIn(issue, [DESCRIPTION_FQN, 0]);
  const priority = getIn(issue, [PRIORITY_FQN, 0]);
  const reporterName = getIn(reporter, [PERSON_ID_FQN, 0]);
  const status = getIn(issue, [STATUS_FQN, 0]) || 'Open';
  const title = getIn(issue, [TITLE_FQN, 0]);
  const subjectName = getLastFirstMiFromPerson(subject, true);
  const actionPath = getJumpToActionPath(subject, category, match.url);
  const issueEKID = getIn(issue, [OPENLATTICE_ID_FQN, 0]);

  const resolveOptions = useMemo(() => STATUS_VALUES.map((statusValue) => ({
    label: statusValue,
    onClick: () => dispatch(setIssueStatus({
      entityKeyId: issueEKID,
      status: statusValue
    }))
  })), [dispatch, issueEKID]);

  const copyLink = () => {
    const issueURL = getIssueUrl(issueEKID, match);
    navigator.clipboard.writeText(issueURL);
    copy();
  };

  return (
    <IssueDetailsWrapper>
      { !hideTitle && <Title>{title}</Title> }
      <LabelGroup>
        <Label subtle>Subject: </Label>
        <span>{subjectName}</span>
      </LabelGroup>
      <ButtonGroup>
        {
          authorized && (
            <>
              <Button
                  size="sm"
                  onClick={open}>
                Edit
              </Button>
              <DropdownButton
                  isLoading={isLoading}
                  options={resolveOptions}
                  size="sm"
                  title="Status" />
              <LinkButton
                  to={actionPath}
                  state={Map({
                    issue,
                    reporter,
                    subject,
                    assignee,
                  })}
                  size="sm"
                  mode="primary">
                Jump to Action
              </LinkButton>
            </>
          )
        }
        {
          navigator.clipboard.writeText && (
            <Button
                size="sm"
                mode={hasCopied ? 'positive' : 'default'}
                onClick={copyLink}>
              {hasCopied ? 'Copied URL' : 'Copy URL'}
            </Button>
          )
        }
      </ButtonGroup>
      <LabelGrid>
        <LabelGroup>
          <Label subtle>Priority: </Label>
          <span>{priority}</span>
        </LabelGroup>
        <LabelGroup>
          <Label subtle>Status: </Label>
          <span>{status}</span>
        </LabelGroup>
        <LabelGroup>
          <Label subtle>Assignee: </Label>
          <span>{assigneeName}</span>
        </LabelGroup>
        <LabelGroup>
          <Label subtle>Reporter: </Label>
          <span>{reporterName}</span>
        </LabelGroup>
        <LabelGroup>
          <Label subtle>Category: </Label>
          <span>{category}</span>
        </LabelGroup>
      </LabelGrid>
      <Label subtle>Description</Label>
      <div>{description}</div>
      <IssueModal
          assignee={assignee}
          currentUser={reporter}
          edit
          isVisible={isVisible}
          issue={issue}
          onClose={close}
          person={subject} />
    </IssueDetailsWrapper>
  );
};

IssueDetails.defaultProps = {
  assignee: Map(),
  hideTitle: false,
  issue: Map(),
  reporter: Map(),
  subject: Map(),
};

export default IssueDetails;
