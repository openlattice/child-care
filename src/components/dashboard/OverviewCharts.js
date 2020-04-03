/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { DateTime } from 'luxon';
import {
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import ChartTooltip from './charts/ChartTooltip';
import ChartWrapper from './charts/ChartWrapper';
import DayAndTimeHeatMap from './charts/DayAndTimeHeatMap';
import SimpleBarChart from './charts/SimpleBarChart';

import { DASHBOARD_COUNTS } from '../../shared/Consts';

const OverviewChartsWrapper = styled.div`
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
  dashboardCounts :Map,
  months :number
};

const OverviewCharts = ({ dashboardCounts, months } :Props) => {

  const tooltip = (counted, { title, formatAsString }, { label, payload }) => (
    <ChartTooltip>
      <TooltipRow>
        <div>{`${title}: ${formatAsString(label)}`}</div>
      </TooltipRow>
      {(payload && payload.length) ? payload.map((point) => (
        <TooltipRow key={point.name}>
          <div>{`Number of ${counted}: ${point.value}`}</div>
        </TooltipRow>
      )) : null}
    </ChartTooltip>
  );

  const getTimeAsNumber = (timeStr :string) :number => {
    const timeDT = DateTime.fromISO(timeStr);

    if (!timeDT.isValid) {
      return 0;
    }
    const hr = timeDT.hour;
    const min = timeDT.minute;
    return (hr * 60) + min;
  };

  const getTimeFromNumber = (timeNum) => {
    let hr = `${Math.floor(timeNum / 60)}`;
    hr = hr.length < 2 ? `0${hr}` : hr;
    let min = `${timeNum % 60}`;
    min = min.length < 2 ? `0${min}` : min;
    return DateTime.fromISO(`${hr}:${min}`).toLocaleString(DateTime.TIME_SIMPLE);
  };

  const getDateAsNumber = (dateStr) => {
    const date = DateTime.fromISO(dateStr).startOf('day');

    if (!date.isValid) {
      return 0;
    }

    const start = DateTime.local().minus({ months }).startOf('day');
    return date.diff(start, 'days').days;
  };

  const getDateFromNumber = (dateNum) => {
    const date = DateTime.local().minus({ months }).plus({ days: dateNum });
    return date.toLocaleString({ month: 'short', day: 'numeric' });
  };

  const renderTimelineChart = (chartType) => {
    const {
      formatAsNumber,
      formatAsString,
      color,
      title,
      countKey,
      maxVal
    } = chartType;

    const countMap = dashboardCounts.get(countKey, Map());
    const data = countMap
      .keySeq()
      .sortBy((dateStr1) => DateTime.fromISO(dateStr1).valueOf())
      .map((dateStr) => ({
        [title]: formatAsNumber(dateStr),
        count: countMap.get(dateStr)
      })).toJS();

    return (
      <FractionWidthContainer items={2}>
        <ChartWrapper
            title={`Reports by ${title}`}
            yLabel="# reports"
            xLabel={title}>
          <LineChart width={500} height={250} data={data}>
            <XAxis type="number" dataKey={title} tickFormatter={formatAsString} domain={[0, maxVal]} />
            <YAxis type="number" dataKey="count" />
            <Tooltip content={(pointData) => tooltip('reports', chartType, pointData)} />
            <Line type="monotone" dataKey="count" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ChartWrapper>
      </FractionWidthContainer>
    );
  };

  const timelineChartTypes = {
    date: {
      formatAsNumber: getDateAsNumber,
      formatAsString: getDateFromNumber,
      color: '#6124e2',
      title: 'Date',
      countKey: DASHBOARD_COUNTS.REPORTS_BY_DATE,
      maxVal: 31
    },
    time: {
      formatAsNumber: getTimeAsNumber,
      formatAsString: getTimeFromNumber,
      color: '#00be84',
      title: 'Time',
      countKey: DASHBOARD_COUNTS.REPORTS_BY_TIME,
      maxVal: 60 * 24
    }
  };

  const renderBarChart = (title, color, countKey, isNumeric = false, isVertical = false) => (
    <SimpleBarChart
        vertical={isVertical}
        isNumeric={isNumeric}
        dashboardCounts={dashboardCounts}
        title={title}
        color={color}
        countKey={countKey}
        numItems={3} />
  );

  return (
    <OverviewChartsWrapper>
      <RowHeader>Incident timeline</RowHeader>
      <ChartRow>
        {renderTimelineChart(timelineChartTypes.date)}
        {renderTimelineChart(timelineChartTypes.time)}
      </ChartRow>
      <ChartRow>
        <DayAndTimeHeatMap counts={dashboardCounts.get(DASHBOARD_COUNTS.REPORTS_BY_DAY_OF_WEEK, Map())} />
      </ChartRow>
      <RowHeader>Consumer demographics</RowHeader>
      <ChartRow>
        {renderBarChart('Age', '#ffc59e', DASHBOARD_COUNTS.AGE, true)}
        {renderBarChart('Race', '#f89090', DASHBOARD_COUNTS.RACE)}
        {renderBarChart('Gender', '#7dd2ff', DASHBOARD_COUNTS.GENDER)}
      </ChartRow>
    </OverviewChartsWrapper>
  );
};

export default OverviewCharts;
