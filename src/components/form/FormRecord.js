// @flow
import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Button } from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import type { RequestSequence } from 'redux-reqseq';

import { MEDIA_QUERY_LG } from '../../core/style/Sizes';
import {
  DATE_TIME_FQN,
  PERSON_ID_FQN,
} from '../../edm/DataModelFqns';
import { useAuthorization } from '../hooks';

const StyledFormWrapper = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: flex-start;
  background: #fff;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);
  flex-direction: row;
  font-size: 14px;
  padding: 20px;
  flex-wrap: wrap;

  @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
    font-size: 16px;
  }
`;

const RecordGrid = styled.div`
  display: grid;
  width: 100%;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
`;

const ActionGrid = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-template-columns: 1fr 1fr;
  margin-left: auto;
`;

const Bold = styled.b`
  font-weight: 600;
  color: #2e2e34;

  ::after {
    content: ": ";
  }
`;

const StyledDiv = styled.div`
  line-height: 20px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

type RecordProps = {
  label :string;
  time :string;
  email :string;
};

const Record = ({ label, time, email } :RecordProps) => (
  <div>
    <StyledDiv>
      <span>
        <Bold>{label}</Bold>
        {DateTime.fromISO(time).toLocaleString(DateTime.DATETIME_SHORT)}
      </span>
    </StyledDiv>
    <StyledDiv>
      <span>
        <Bold>By</Bold>
        {email}
      </span>
    </StyledDiv>
  </div>
);

type FormRecordProps = {
  authorize :RequestSequence;
  lastUpdated :Map;
  onClickPrimary :() => void;
  onClickSecondary :() => void;
  primaryText ? :string;
  secondaryText ? :string;
  submitted :Map;
}
const FormRecord = ({
  authorize,
  lastUpdated,
  onClickPrimary,
  onClickSecondary,
  primaryText,
  secondaryText,
  submitted,
} :FormRecordProps) => {

  const [isAuthorized] = useAuthorization('profile', authorize);

  const submittedTime = submitted.getIn(['associationDetails', DATE_TIME_FQN, 0], '');
  const submittedEmail = submitted.getIn(['neighborDetails', PERSON_ID_FQN, 0], '');
  const lastTime = lastUpdated.getIn(['associationDetails', DATE_TIME_FQN, 0], '');
  const lastEmail = lastUpdated.getIn(['neighborDetails', PERSON_ID_FQN, 0], '');

  return (
    <StyledFormWrapper>
      <RecordGrid>
        <Record
            label="Submitted"
            time={submittedTime}
            email={submittedEmail} />
        { !lastUpdated.isEmpty()
          && (
            <Record
                label="Last Updated"
                time={lastTime}
                email={lastEmail} />
          )}
      </RecordGrid>
      {
        isAuthorized && (
          <ActionGrid>
            {
              onClickPrimary
              && (
                <Button
                    onClick={onClickPrimary}
                    mode="primary">
                  {primaryText}
                </Button>
              )
            }
            {
              onClickSecondary
              && (
                <Button
                    onClick={onClickSecondary}
                    mode="secondary">
                  {secondaryText}
                </Button>
              )
            }
          </ActionGrid>
        )
      }
    </StyledFormWrapper>
  );
};

FormRecord.defaultProps = {
  primaryText: 'Edit',
  secondaryText: 'Delete'
};

export default FormRecord;
