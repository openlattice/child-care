/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';

import HeatMap from './charts/HeatMap';
import SimpleBarChart from './charts/SimpleBarChart';

import { DASHBOARD_COUNTS } from '../../shared/Consts';

const OutcomeChartsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 30px 0;
`;

const ChartRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const RowHeader = styled.div`
  width: 100%;
  margin: 20px 0 10px 0;
  font-size: 20px;
  color: #2e2e34;
  font-weight: 600;
`;

type Props = {
  dashboardCounts :Map
};

const OutcomeCharts = ({ dashboardCounts } :Props) => {

  const renderBarChart = (title, color, countKey) => (
    <SimpleBarChart
        vertical
        dashboardCounts={dashboardCounts}
        title={title}
        color={color}
        countKey={countKey}
        numItems={2} />
  );


  const renderDeescalationDispositionHeatmap = () => {
    const countMap = dashboardCounts.get(DASHBOARD_COUNTS.DISPOSITIONS_BY_DEESCALATION, Map());
    const deescList = countMap.keySeq();
    const dispList = deescList.size ? countMap.valueSeq().first().keySeq() : List();
    return (
      <HeatMap
          title="Dispositions by de-escalation techniques"
          rowHeaders={dispList}
          colValues={deescList}
          cellSize={50}
          counts={countMap}
          exponential
          withContent />
    );
  };

  return (
    <OutcomeChartsWrapper>
      <RowHeader>Dispositions</RowHeader>
      <ChartRow>
        {renderBarChart('Disposition', '#ffc59e', DASHBOARD_COUNTS.DISPOSITIONS)}
        {renderBarChart('De-escalation techniques', '#f89090', DASHBOARD_COUNTS.DEESCALATION)}
      </ChartRow>
      <ChartRow>
        {renderBarChart('Specialized resources', '#7dd2ff', DASHBOARD_COUNTS.RESOURCES)}
        {renderBarChart('Officer certifications', '#a57cff', DASHBOARD_COUNTS.CERTIFICATIONS)}
      </ChartRow>
      <ChartRow>
        {renderDeescalationDispositionHeatmap()}
      </ChartRow>
    </OutcomeChartsWrapper>
  );
};

export default OutcomeCharts;
