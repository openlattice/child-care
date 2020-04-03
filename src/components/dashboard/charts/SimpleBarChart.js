// @flow

import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import {
  Bar,
  BarChart,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import ChartTooltip from './ChartTooltip';
import ChartWrapper from './ChartWrapper';
import CustomTick from './CustomTick';

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

type Props = {
  dashboardCounts :Map;
  height ?:number;
  title :string;
  color :string;
  countKey :string;
  numItems :any;
  isNumeric ?:boolean;
  vertical ?:boolean;
};

const SimpleBarChart = ({
  dashboardCounts,
  height,
  title,
  color,
  countKey,
  numItems,
  isNumeric,
  vertical
} :Props) => {
  const countMap = dashboardCounts.get(countKey, Map());
  const items = numItems || 3;
  const width = 1080 / items;
  const data = countMap
    .keySeq()
    .sort((o1, o2) => {
      const v1 = isNumeric ? o1 : countMap.get(o1);
      const v2 = isNumeric ? o2 : countMap.get(o2);
      return v1 > v2 ? -1 : 1;
    })
    .map((o) => ({
      [title]: isNumeric ? o : `${o}`,
      count: countMap.get(o)
    })).toJS();

  const layout = vertical ? 'vertical' : 'horizontal';
  const NumberAxis = vertical ? XAxis : YAxis;
  const KeyAxis = vertical ? YAxis : XAxis;
  const tickProps = vertical ? { tick: CustomTick } : {};
  const chartHeight = height || (vertical ? 500 : 250);
  const yLabel = vertical ? '' : '#consumers';
  const xLabel = vertical ? '#consumers' : '';

  /* eslint-disable react/jsx-props-no-spreading */
  return (
    <FractionWidthContainer items={items}>
      <ChartWrapper title={title} yLabel={yLabel} xLabel={xLabel} noOffset={vertical}>
        <BarChart layout={layout} width={width} height={chartHeight} data={data}>
          <KeyAxis type={isNumeric ? 'number' : 'category'} dataKey={title} {...tickProps} />
          <NumberAxis type="number" dataKey="count" />
          <Tooltip content={(pointData) => tooltip('consumers', { title, formatAsString: (i) => `${i}` }, pointData)} />
          <Bar dataKey="count" fill={color} />
        </BarChart>
      </ChartWrapper>
    </FractionWidthContainer>
  );
};

SimpleBarChart.defaultProps = {
  height: undefined,
  isNumeric: false,
  vertical: false,
};

export default SimpleBarChart;
