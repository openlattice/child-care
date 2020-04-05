/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import { faPlus, faMinus } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  GRAY,
  OFF_WHITE,
  PURPLE,
  WHITE,
} from '../../shared/Colors';

type Props = {
  value :number,
  onChange :(value :number) => void;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 3px;
  background-color: #F9F9FD;
  border: 1px solid #DCDCE7;
  height: 40px;
  width: 180px;
`;

const getBackgroundColor = ({ disabled, selected } :any) => {
  if (disabled && selected) return GRAY;
  return selected ? PURPLE : WHITE;
};

const getColor = ({ disabled, selected } :any) => {
  if (selected) return WHITE;
  return (disabled) ? GRAY : PURPLE;
};

const Button = styled.button`
  width: 33%;
  height: 100%;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: #F9F9FD;
  color: #535253;
  border: none;
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 22px;
  /* identical to box height */

  text-align: center;
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

  &:hover:enabled {
    cursor: pointer;
    background-color: #dcdce7;
  }

  &:first-child {
    border-radius: ${(props) => (props.selected ? 0 : '3px 0 0 3px')};
  }

  &:last-child {
    border-radius: ${(props) => (props.selected ? 0 : '0 3px 3px 0')};
  }

  &:focus {
    outline: none;
  }
`;

const PlusMinus = ({ value, onChange } :Props) => (
  <Wrapper>
    <Button disabled={!value} onClick={() => onChange(value - 1)}>
      <FontAwesomeIcon icon={faMinus} />
    </Button>
    <span>{value}</span>
    <Button onClick={() => onChange(value + 1)}>
      <FontAwesomeIcon icon={faPlus} />
    </Button>
  </Wrapper>
);

export default PlusMinus;
