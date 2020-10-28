/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';

const Control = styled.label`
  color: ${(props) => (props.checked ? '#2e2e34' : '#8e929b')};
  cursor: ${(props) => (props.disabled ? 'default' : 'pointer')};
  display: block;
  font-family: Inter;
  font-size: 16px;
  font-weight: normal;
  margin-bottom: ${(props) => (props.noMargin ? 0 : 10)}px;
  position: relative;
  padding: 0 10px 0 20px;

  input {
    opacity: 0;
    position: absolute;
    z-index: -1;
  }
`;

const CheckboxInput = styled.input.attrs({
  type: 'checkbox'
})`
  opacity: 0;
  position: absolute;
  z-index: -1;
`;

const CheckboxIndicator = styled.div`
  background: #E6E6F7;
  border-radius: 2px;
  height: 20px;
  left: 0;
  margin-top: -2px;
  position: absolute;
  top: 0;
  width: 20px;

  ${Control}:hover input ~ &,
  ${Control} input:focus & {
    background: #CCCCCC;
  }

  ${Control} input:checked ~ & {
    background: #6124e2;
  }

  ${Control}:hover input:not([disabled]):checked ~ &,
  ${Control} input:checked:focus & {
    background: #6124e2;
  }

  ${Control} input:disabled ~ & {
    background: #b6bbc6;
    opacity: 0.6;
    pointer-events: none;
  }

  &:after {
    border: solid #FFFFFF;
    border-width: 0 2px 2px 0;
    content: '';
    display: none;
    height: 8px;
    left: 8px;
    position: absolute;
    top: 4px;
    transform: rotate(45deg);
    width: 3px;

    ${Control} input:disabled ~ &,
    ${Control} input:checked ~ & {
      display: block;
    }

    ${Control} & {
      border: solid #FFFFFF;
      border-width: 0 2px 2px 0;
      height: 10px;
      left: 8px;
      top: 4px;
      transform: rotate(45deg);
      width: 5px;
    }
  }
`;

const CheckboxLabel = styled.span`
  color: #2e2e34;
  font-weight: ${(props) => (props.bold ? 600 : 400)};
  margin-left: 5px;
`;

type Props = {
  bold? :string;
  checked :boolean;
  dataSection? :?string;
  disabled? :boolean;
  label :string;
  name :string;
  noMargin? :boolean;
  onChange :(event :Object) => void;
  value :string;
};

const StyledCheckbox = ({
  name,
  label,
  value,
  checked,
  onChange,
  disabled,
  dataSection,
  bold,
  noMargin
} :Props) => (
  <Control disabled={disabled} checked={checked} noMargin={noMargin}>
    <CheckboxLabel bold={bold}>{label}</CheckboxLabel>
    <CheckboxInput
        data-section={dataSection}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled} />
    <CheckboxIndicator />
  </Control>
);

StyledCheckbox.defaultProps = {
  disabled: false,
  dataSection: '',
  bold: false,
  noMargin: false
};

export default StyledCheckbox;
