// @flow
import React from 'react';

import styled from 'styled-components';
import { faFileAlt } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Map } from 'immutable';
import { Card, CardSegment, StyleUtils } from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';

import * as FQN from '../../../edm/DataModelFqns';
import { CRISIS_REPORT_PATH, REPORT_ID_PATH } from '../../../core/router/Routes';
import { goToPath } from '../../../core/router/RoutingActions';

const { media } = StyleUtils;

const Grid = styled.div`
  display: grid;
  grid-gap: 10px;
  grid-auto-flow: column;
  ${media.tablet`
    grid-auto-flow: row;
  `}
`;

const StyledSpan = styled.span`
  margin-left: 30px;
`;

type Props = {
  report :Map;
};

const LastReport = (props :Props) => {

  const dispatch = useDispatch();

  const { report } = props;
  const reportEKID :UUID = report.getIn(['neighborDetails', FQN.OPENLATTICE_ID_FQN, 0]);
  const type :string = report.getIn(['neighborDetails', FQN.TYPE_FQN, 0]);

  const lastReporter = useSelector((store) => store.getIn(['profile', 'reports', 'lastReporters', reportEKID, 0]));
  const reporter = lastReporter.getIn(['neighborDetails', FQN.PERSON_ID_FQN, 0]) || '';
  const created = lastReporter.getIn(['associationDetails', FQN.COMPLETED_DT_FQN, 0]);
  const createdDT = DateTime.fromISO(created);

  const loggedDate = createdDT.isValid ? `on ${createdDT.toLocaleString(DateTime.DATE_SHORT)}` : '';
  const loggedCreator = reporter ? `by ${reporter}` : '';

  const logMessage = (loggedDate || loggedCreator) ? `Created ${loggedDate} ${loggedCreator}` : '';

  const handleClick = () => {
    dispatch(goToPath(CRISIS_REPORT_PATH.replace(REPORT_ID_PATH, reportEKID)));
  };

  return (
    <Card onClick={handleClick}>
      <CardSegment vertical>
        <Grid>
          <span>
            <FontAwesomeIcon icon={faFileAlt} />
            <StyledSpan>{type}</StyledSpan>
          </span>
          <div>
            { logMessage }
          </div>
        </Grid>
      </CardSegment>
    </Card>
  );
};

export default LastReport;
