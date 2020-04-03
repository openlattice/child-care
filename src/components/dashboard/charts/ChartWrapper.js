/*
 * @flow
 */

import React from 'react';
import type { Node } from 'react';

import styled from 'styled-components';
import { Button } from 'lattice-ui-kit';

const Card = styled.div`
  position: relative;
  width: 100%;
  border-radius: 5px;
  background-color: #fff;
  border: 1px solid #e1e1eb;
  padding: 30px;
  margin-top: 20px;
`;

const HeaderRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  h1 {
    margin: 0;
    font-size: 20px;
    font-weight: 600;
    color: #2e2e34;
    justify-self: flex-start;
  }
`;

const Buttons = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
`;

const ExplainTooltip = styled.div`
  position: absolute;
  z-index: 5;
  right: 10px;
  top: 65px;
  width: 230px;
  padding: 10px;
  border-radius: 3px;
  background-color: #555e6f;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.1);
  font-size: 12px;
  font-weight: 400;
  color: #fff;
  line-height: normal;
  visibility: hidden;
`;

const ExplainButton = styled.div`
  background-color: #f0f0f7;
  color: #8e929b;
  padding: 0;
  height: 22px;
  width: 22px;
  border-radius: 50%;
  font-weight: bold;
  margin-left: 20px;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    ${ExplainTooltip} {
      visibility: visible;
    }
  }
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  align-items: center;
  margin-left: ${(props) => (props.noOffset ? 0 : -40)}px;
`;

const FooterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
`;

const XLabel = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #8e929b;
  text-transform: uppercase;
  height: 20px;
  min-width: fit-content;
  margin: 0;
`;

const YLabelWrapper = styled.div`
  height: 100%;
  width: 20px;
  max-width: 20px;
  justify-self: ${(props) => (props.secondary ? 'flex-end' : 'flex-start')};
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const getMarginLeft = ({ secondary, withMargin } :any) => {
  if (withMargin) {
    return '-200%';
  }
  if (secondary) {
    return '-400%';
  }
  return '0%';
};

const YLabel = styled(XLabel)`
  transform: rotate(270deg);
  white-space: nowrap;
  margin-left: ${getMarginLeft};
`;

type Props = {
  children :Node;
  downloadFn ?:() => void;
  infoText ?:string;
  noMargin ?:boolean;
  noOffset ?:boolean;
  title :string;
  xLabel ?:string;
  yLabel ?:string;
  yLabelRight ?:string;
};

const ChartWrapper = ({
  downloadFn,
  infoText,
  children,
  noMargin,
  noOffset,
  title,
  xLabel,
  yLabel,
  yLabelRight
} :Props) => (
  <Card>
    <HeaderRow>
      <h1>{title}</h1>
      <Buttons>
        {downloadFn ? <Button mode="secondary" onClick={downloadFn}>Download</Button> : null}
        {infoText ? (
          <ExplainButton>
            <span>?</span>
            <ExplainTooltip>{infoText}</ExplainTooltip>
          </ExplainButton>
        ) : null}
      </Buttons>
    </HeaderRow>
    <BodyWrapper noOffset={noOffset}>
      {yLabel ? (
        <YLabelWrapper>
          <YLabel noMargin={noMargin}>{yLabel}</YLabel>
        </YLabelWrapper>
      ) : null}
      {children}
      {yLabelRight ? (
        <YLabelWrapper secondary>
          <YLabel noMargin={noMargin} secondary>{yLabelRight}</YLabel>
        </YLabelWrapper>
      ) : null}
    </BodyWrapper>
    {
      xLabel ? (
        <FooterWrapper>
          <XLabel>{xLabel}</XLabel>
        </FooterWrapper>
      ) : null
    }
  </Card>
);

ChartWrapper.defaultProps = {
  downloadFn: undefined,
  infoText: undefined,
  noMargin: undefined,
  noOffset: undefined,
  xLabel: undefined,
  yLabel: undefined,
  yLabelRight: undefined,
};

export default ChartWrapper;
