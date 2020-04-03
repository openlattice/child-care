// @flow
import React, { Component } from 'react';

import { Colors } from 'lattice-ui-kit';
import {
  Bar,
  BarChart,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

import ChartTooltip from './ChartTooltip';
import PercentTick from './PercentTick';

const { PURPLES } = Colors;

type Props = {
  data :Object[];
  total :number;
};

class BasicBarChart extends Component <Props> {

  renderTooltip = ({ label, payload } :any) => {
    const data = payload[0];
    if (data && data.payload) {
      const { count, percent } = data.payload;
      return (
        <ChartTooltip>
          <div>{label}</div>
          <div>{`count: ${count}`}</div>
          <div>{`percent: ${percent}`}</div>
        </ChartTooltip>
      );
    }

    return null;
  };

  renderLabel = (labelProps :any) => {
    const { total } = this.props;
    const {
      height,
      offset,
      value,
      width,
      x,
      y,
    } = labelProps;
    const percentage = Math.round((value / total) * 100);
    return <text x={x + width + 5} y={y + offset + height / 2}>{`${value} (${percentage}%)`}</text>;
  }

  render() {
    const { data } = this.props;
    const numberOfBars = data.length;

    return (
      <ResponsiveContainer minHeight={40 * numberOfBars} width="100%">
        <BarChart
            margin={{ right: 80 }}
            layout="vertical"
            data={data}>
          <YAxis
              tickLine={false}
              width={150}
              dataKey="name"
              tick={PercentTick}
              type="category" />
          <XAxis
              dataKey="percent"
              hide
              type="number"
              domain={[0, 100]} />
          <Tooltip content={this.renderTooltip} />
          <Bar
              barSize={24}
              maxBarSize={32}
              unit="%"
              dataKey="percent"
              fill={PURPLES[2]}
              background={{ fill: PURPLES[6] }}>
            <LabelList
                dataKey="count"
                position="right"
                content={this.renderLabel} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }
}

export default BasicBarChart;
