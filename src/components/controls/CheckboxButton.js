import React from 'react';
import styled, { css } from 'styled-components';

import { APP_CONTAINER_WIDTH } from '../../core/style/Sizes';

const Wrapper = styled.div`
  padding: 20px;
  border-radius: 3px;
  width: calc(min(100vw, ${APP_CONTAINER_WIDTH}px) - 50px);
  margin-top: ${(props) => props.marginTop};
`;

const SelectedValue = styled(Wrapper)`
  background-color: #e4d8ff;
  color: #6124e2;

  &:hover {
    background-color: #d0bbff;
    cursor: pointer;
  }
`;

const UnselectedValue = styled(Wrapper)`
  background-color: #F9F9FD;
  color: #8E929B;

  &:hover {
    background-color: #dcdce7;
    cursor: pointer;
  }
`;

export default ({
  label,
  value,
  isSelected,
  onChange,
  marginTop
}) => {

  const Component = isSelected ? SelectedValue : UnselectedValue;

  return (
    <Component marginTop={marginTop || 0} onClick={() => onChange(value)}>
      {label}
    </Component>
  );
};
