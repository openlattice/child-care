// @flow
import React from 'react';
import styled from 'styled-components';
import { StepIcon } from 'lattice-ui-kit';

const FlexWrapper = styled.div`
  display: flex;
`;

const StyledStepIcon = styled(StepIcon)`
  margin-right: 10px;
`;

const ContentWrapper = styled.div`
  flex-direction: column;
  word-break: break-word;
`;

const StrategyTitle = styled.h2`
  margin: 0 0 8px 0;
  font-weight: 600;
  font-size: 18px;
  min-width: 0;
`;

const Text = styled.p`
  white-space: pre-wrap;
  min-width: 0;
`;

type Props = {
  title :string;
  description :string;
  index :number;
};

const InteractionStrategy = ({ title, description, index } :Props) => (
  <FlexWrapper>
    <StyledStepIcon index={index} />
    <ContentWrapper>
      <StrategyTitle>{title}</StrategyTitle>
      <Text>{description}</Text>
    </ContentWrapper>
  </FlexWrapper>
);

export default InteractionStrategy;
