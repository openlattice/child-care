// @flow

import React from 'react';
import type { Node } from 'react';

import styled from 'styled-components';

const TooltipCard = styled.div`
  background-color: #fff;
  border-radius: 3px;
  border: 1px solid #e1e1eb;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
  color: #2e2e34;
  display: flex;
  flex-direction: column;
  font-size: 12px;
  font-weight: 600;
  justify-content: flex-start;
  padding: 10px 15px;

  span {
    margin: 5px 0;
  }
`;

type Props = {
  children :Node;
}

const ChartTooltip = ({ children } :Props) => (
  <TooltipCard>
    {children}
  </TooltipCard>
);

export default ChartTooltip;
