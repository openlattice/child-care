/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { Map, Set } from 'immutable';
import {
  Bar,
  BarChart,
  Legend,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import ChartTooltip from './charts/ChartTooltip';
import ChartWrapper from './charts/ChartWrapper';
import SimpleBarChart from './charts/SimpleBarChart';

import { DASHBOARD_COUNTS } from '../../shared/Consts';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 30px 0;
`;

const ChartRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const FractionWidthContainer = styled.div`
  width: ${(props) => ((100 / props.items) - 1)}%;
`;

const TooltipRow = styled.div`
  margin: 5px 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
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

const IncidentCharts = ({ dashboardCounts } :Props) => {

  const tooltip = (counted, { title, formatAsString }, { label, payload }, optionalHeaders) => {
    const { mainHeader, subHeader } = (optionalHeaders || {});
    const headerTitle = mainHeader || title;
    return (
      <ChartTooltip>
        <TooltipRow>
          <div>{`${headerTitle}: ${formatAsString(label)}`}</div>
        </TooltipRow>
        {(payload && payload.length) ? payload.map((point) => {
          let valueLabel = counted ? `Number of ${counted}` : point.dataKey;
          if (subHeader) {
            valueLabel = `${valueLabel} (${subHeader})`;
          }
          return (
            <TooltipRow key={point.name}>
              <div>{`${valueLabel}: ${point.value}`}</div>
            </TooltipRow>
          );
        }) : null}
      </ChartTooltip>
    );
  };

  const renderBarChart = (title, color, countKey, numItems, isVertical, isShort) => (
    <SimpleBarChart
        vertical={isVertical}
        dashboardCounts={dashboardCounts}
        title={title}
        color={color}
        height={isShort ? 250 : undefined}
        countKey={countKey}
        numItems={numItems} />
  );

  const renderDoubleBarChart = (title, color, countKey1, numItems) => {
    const colors = ['#00be84', '#f25497', '#0021ba', '#bc0000', '#ffde00'];

    const countMap = dashboardCounts.get(countKey1, Map());
    const items = numItems || 3;
    const width = 1180 / items;

    let fields = Set();
    const data = countMap
      .entrySeq()
      .map(([count1, innerMap]) => {
        let point = Map().set([title], count1);
        innerMap.entrySeq().forEach(([field, count]) => {
          fields = fields.add(field);
          point = point.set(field, count);
        });

        return point;
      }).toJS();

    const headers = {
      mainHeader: 'Prescribed medication',
      subHeader: 'taking medication'
    };

    return (
      <FractionWidthContainer items={items}>
        <ChartWrapper title={title} yLabel="# consumers" xLabel=" ">
          <BarChart width={width} height={250} data={data}>
            <XAxis type="category" dataKey={title} />
            <YAxis type="number" />
            <Tooltip content={(pointData) => tooltip(null, { title, formatAsString: (i) => i }, pointData, headers)} />
            {fields.toList().map((dataKey, index) => <Bar key={dataKey} dataKey={dataKey} fill={colors[index]} />)}
            <Legend />
          </BarChart>
        </ChartWrapper>
      </FractionWidthContainer>
    );
  };

  return (
    <Wrapper>
      <RowHeader>Consumer state</RowHeader>
      <ChartRow>
        {renderBarChart('Emotional states', '#00bace', DASHBOARD_COUNTS.EMOTIONAL_STATE, 2, true)}
        {renderBarChart('Observed behaviors', '#ff9a58', DASHBOARD_COUNTS.BEHAVIORS, 2, true)}
      </ChartRow>
      <ChartRow>
        {renderBarChart('Self diagnoses', '#a939ff', DASHBOARD_COUNTS.SELF_DIAGNOSIS, 3, true, true)}
        {renderDoubleBarChart('Medication prescriptions vs. usage', '#00be84', DASHBOARD_COUNTS.MEDICATION, 3)}
        {renderBarChart('Injuries', '#f7b9d3', DASHBOARD_COUNTS.INJURIES, 3, true, true)}
      </ChartRow>
      <RowHeader>Violence</RowHeader>
      <ChartRow>
        {renderBarChart('Armed', '#bc0000', DASHBOARD_COUNTS.ARMED, 4)}
        {renderBarChart('Armed weapon types', '#f89090', DASHBOARD_COUNTS.ARMED_WEAPON_TYPES, 4)}
        {renderBarChart('Access to weapons', '#ff9a58', DASHBOARD_COUNTS.WEAPON_ACCESS, 4)}
        {renderBarChart('Access weapon types', '#ffc59e', DASHBOARD_COUNTS.ACCESS_WEAPON_TYPES, 4)}
      </ChartRow>
      <RowHeader>Self harm</RowHeader>
      <ChartRow>
        {renderBarChart('Suicidal', '#00583d', DASHBOARD_COUNTS.SUICIDAL, 3)}
        {renderBarChart('Suicidal actions', '#a57cff', DASHBOARD_COUNTS.SUICIDAL_ACTIONS, 3)}
        {renderBarChart('Suicide method', '#2f69ff', DASHBOARD_COUNTS.SUICIDE_METHOD, 3)}
      </ChartRow>
    </Wrapper>
  );
};

export default IncidentCharts;
