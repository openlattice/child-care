/*
 * @flow
 */

import React from 'react';

import styled, { css } from 'styled-components';
import { Map } from 'immutable';

import HEATMAP_COLORS from '../constants/HeatMapColors';

type Props = {
  title :string,
  colValues :string[],
  colHeaderFormatter :(colValue :Object) => string,
  rowHeaders :string[],
  rowHeaderFormatter :(colValue :Object) => string,
  cellSize :number,
  counts :Map,
  withContent? :boolean,
  square? :boolean,
  exponential? :boolean
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  background-color: #fff;
  border: 1px solid #e1e1eb;
  padding: 30px;
  margin-top: 20px;
`;

const Title = styled.div`
  font-weight: 600;
  color: #2e2e34;
  font-size: 20px;
  margin-bottom: 20px;
`;

const Row = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const BaseCell = styled.div`
  align-items: center;
  border-radius: 5px;
  display: flex;
  flex-direction: row;
  height: ${(props) => props.size}px;
  justify-content: center;
  margin: 2px;
  text-align: center;
  width: ${(props) => (props.square ? `${props.size}px` : '100%')};
`;

const Label = styled(BaseCell)`
  font-size: 14px;
  font-weight: 400;
  color: #2e2e34;
  word-break: break-word;
`;

const backgroundColorStyle = css`
  background-color: ${(props) => props.color};
`;

const Cell = styled(BaseCell)`
  ${backgroundColorStyle}
`;

const LegendWrapper = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  height: 50px;
`;

const LegendItem = styled.div`
  height: 100%;
  width: 50px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;

  span:last-child {
    color: #8e929b;
    font-size: 12px;
    font-weight: 400;
    margin-left: 5px;
  }
`;

const LegendColor = styled.div`
  width: 100%;
  height: 20px;
  ${backgroundColorStyle}
`;

const getNHeatmapColors = (num) => {
  if (num <= 1) return [HEATMAP_COLORS[0]];

  const interval = (HEATMAP_COLORS.length - 1) / (num - 1);

  const heatmapColors = [];
  for (let i = 0; i < num; i += 1) {
    heatmapColors.push(HEATMAP_COLORS[Math.round(i * interval)]);
  }

  return heatmapColors;
};

const getChunkSize = (max, min, numColors) => ((max + 1) - min) / numColors;

const getOffset = (max, count, numColors, exponential) => {
  if (!exponential) return Math.floor((max - count) / getChunkSize(max, 0, numColors)) + 1;

  if (count === 0) {
    return numColors;
  }
  if (count >= max) {
    return 1;
  }

  return numColors - Math.floor(Math.log(count ** numColors) / Math.log(max));
};

const HeatMap = ({
  title,
  colValues,
  colHeaderFormatter,
  rowHeaders,
  rowHeaderFormatter,
  cellSize,
  counts,
  withContent,
  square,
  exponential
} :Props) => {

  const min = 0;
  let max = 0;

  counts.valueSeq().forEach((subCounts) => {
    subCounts.forEach((count) => {
      if (count > max) {
        max = count;
      }
    });
  });

  const heatmapColors = max >= HEATMAP_COLORS.length ? HEATMAP_COLORS : getNHeatmapColors(max + 1);

  const chunkSize = getChunkSize(max, min, heatmapColors.length);

  const renderHeaderRow = () => {
    const labels = [];
    labels.push(<Label square={square} size={cellSize} key={-1} />);
    colValues.forEach((colValue) => {
      labels.push(<Label square={square} size={cellSize} key={colValue}>{colHeaderFormatter(colValue)}</Label>);
    });

    return <Row>{labels}</Row>;
  };

  const renderRow = (rowHeader) => {
    const cells = [];
    cells.push(<Label square={square} size={cellSize} key={rowHeader}>{rowHeaderFormatter(rowHeader)}</Label>);
    colValues.forEach((colValue) => {
      const count = counts.getIn([rowHeader, `${colValue}`], 0);
      const groupOffset = getOffset(max, count, heatmapColors.length, exponential);
      const index = Number.isNaN(groupOffset) ? 0 : heatmapColors.length - groupOffset;

      cells.push(
        <Cell square={square} size={cellSize} key={`${rowHeader}|${colValue}`} color={heatmapColors[index]}>
          {withContent ? count : null}
        </Cell>
      );
    });

    return <Row key={`row-${rowHeader}`}>{cells}</Row>;
  };

  const getLegendValue = (index) => {
    if (!exponential) {
      return Math.ceil(chunkSize * index);
    }
    if (index === 0) {
      return 0;
    }
    return Math.round(max ** (index / heatmapColors.length));
  };

  const renderLegend = () => (
    <LegendWrapper>
      {heatmapColors.map((color, index) => (
        <LegendItem key={`legend|${color}`}>
          <LegendColor color={color} />
          <span>
            &ge;
            {getLegendValue(index)}
          </span>
        </LegendItem>
      ))}
    </LegendWrapper>
  );

  return (
    <Wrapper>
      <Title>{title}</Title>
      {renderHeaderRow()}
      {rowHeaders.map((rowHeader) => renderRow(rowHeader))}
      {renderLegend()}
    </Wrapper>
  );
};

HeatMap.defaultProps = {
  withContent: false,
  colHeaderFormatter: (col) => col,
  rowHeaderFormatter: (row) => row,
  square: false,
  exponential: false
};

export default HeatMap;
