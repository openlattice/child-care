/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';

import {
  GRAY,
  OFF_WHITE,
  PURPLE,
  WHITE,
} from '../../shared/Colors';

type Props = {
  value :boolean,
  onChange :(value :boolean) => void;
  disabled :boolean;
}

const ToggleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 3px;
  border: 2px solid ${({ disabled }) => (disabled ? GRAY : PURPLE)};
  height: 40px;
  width: 130px;
`;

const getBackgroundColor = ({ disabled, selected } :any) => {
  if (disabled && selected) return GRAY;
  return selected ? PURPLE : WHITE;
};

const getColor = ({ disabled, selected } :any) => {
  if (selected) return WHITE;
  return (disabled) ? GRAY : PURPLE;
};

const ToggleTab = styled.div`
  width: 50%;
  height: 100%;
  font-size: 14px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  background-color: ${getBackgroundColor};
  color: ${getColor};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'auto')};

  &:hover {
    cursor: pointer;
    background-color: ${(props) => (props.selected ? PURPLE : OFF_WHITE)};
  }

  &:first-child {
    border-radius: ${(props) => (props.selected ? 0 : '3px 0 0 3px')};
  }

  &:last-child {
    border-radius: ${(props) => (props.selected ? 0 : '0 3px 3px 0')};
  }
`;

const YesNoToggle = ({ value, onChange, disabled } :Props) => (
  <ToggleWrapper disabled={disabled}>
    <ToggleTab disabled={disabled} selected={!value} onClick={() => onChange(false)}>No</ToggleTab>
    <ToggleTab disabled={disabled} selected={value} onClick={() => onChange(true)}>Yes</ToggleTab>
  </ToggleWrapper>
);

export default YesNoToggle;
