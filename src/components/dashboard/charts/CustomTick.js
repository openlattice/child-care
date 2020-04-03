// @flow
import React from 'react';

import styled from 'styled-components';

const Tick = styled.text`
  width: 200px;
  min-height: 20px;
  fill: #2e2e34;
  font-size: 11px;
`;

const MAX_CHARS_PER_LINE = 11;

const splitText = (text :string) => {
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
};

const CustomTick = ({ payload, y } :Props) => {
  const { value } = payload;

  const lines = splitText(value);
  const yInit = y - (lines.length * 6);

  return (
    <Tick x={0} y={yInit} textAnchor="start">
      {lines.map((line) => <tspan x="0" dy={12} key={line}>{line}</tspan>)}
    </Tick>
  );
};

export default CustomTick;
