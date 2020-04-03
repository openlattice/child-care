// @flow
import React from 'react';

import styled from 'styled-components';
import {
  Card,
  CardHeader,
  CardSegment,
  CardStack,
} from 'lattice-ui-kit';
import { useSelector } from 'react-redux';

import LastReport from './LastReport';

import * as FQN from '../../../edm/DataModelFqns';
import { H1 } from '../../../components/layout';

const StyledHeader = styled(CardHeader)`
  border-bottom: none !important;
`;

const LastIncidentCard = () => {
  const lastIncidentReports = useSelector((store) => store.getIn(['profile', 'reports', 'lastIncidentReports']));
  return (
    <Card>
      <StyledHeader>
        <H1>Last Incident</H1>
      </StyledHeader>
      <CardSegment vertical padding="0 30px 30px">
        <CardStack>
          {
            lastIncidentReports.map((report) => {
              const reportEKID :UUID = report.getIn(['neighborDetails', FQN.OPENLATTICE_ID_FQN, 0]);

              return (
                <LastReport key={reportEKID} report={report} />
              );
            })
          }
        </CardStack>
      </CardSegment>
    </Card>
  );
};

export default LastIncidentCard;
