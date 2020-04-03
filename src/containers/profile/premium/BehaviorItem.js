// @flow

import React from 'react';

import styled from 'styled-components';

const BehaviorItemWrapper = styled.div`
  display: grid;
  grid-template-columns: 9fr 1fr;
  grid-gap: 5px;
  padding: 5px 0;
  align-items: center;

  strong:last-child {
    text-align: end;
  }
`;

type Props = {
  name :string;
  count :number;
};

const BehaviorItem = (props :Props) => {
  const { name, count } = props;
  return (
    <BehaviorItemWrapper>
      <strong>{name}</strong>
      <strong>{count}</strong>
    </BehaviorItemWrapper>
  );
};

export default BehaviorItem;
