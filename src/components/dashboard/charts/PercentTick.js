// @flow
import React from 'react';

import styled from 'styled-components';

const Tick = styled.text`
  font-size: 12px;
  min-height: 20px;
`;

const MAX_CHARS_PER_LINE = 20;

const splitText = (text) => {
  const lines = [];
  let currStr = '';
  text
    .replace(/\//g, ' / ')
    .replace(/-/g, ' - ')
    .split(' ')
    .filter((val) => val.length)
    .forEach((word) => {
      const optionalSpace = currStr.length ? ' ' : '';

      if (currStr.length + optionalSpace.length + word.length > MAX_CHARS_PER_LINE) {
        if (currStr.length) {
          lines.push(currStr);
          currStr = word;
        }
        else {
          lines.push(word);
        }
      }

      else {
        currStr = `${currStr}${optionalSpace}${word}`;
      }
    });

  if (currStr.length) {
    lines.push(currStr);
  }

  return lines;
};

type Props = {
  payload :{ value :string };
  y :number;
}

const PercentTick = ({ payload, y } :Props) => {
  const { value } = payload;

  const lines = splitText(value);
  const yInit = y - (lines.length * 10);

  return (
    <Tick x={0} y={yInit} textAnchor="start">
      {lines.map((line) => <tspan x="0" dy={16} key={line}>{line}</tspan>)}
    </Tick>
  );
};

export default PercentTick;
