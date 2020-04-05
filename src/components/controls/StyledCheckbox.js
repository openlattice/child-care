/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';

const Control = styled.label`
  display: block;
  position: relative;
  padding: 0 10px 0 20px;
  margin-bottom: ${props => (props.noMargin ? 0 : 10)}px;
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  font-weight: normal;
  color: ${props => (props.checked ? '#2e2e34' : '#8e929b')};
  cursor: ${props => (props.disabled ? 'default' : 'pointer')};

  input {
    position: absolute;
    z-index: -1;
    opacity: 0;
  }
`;

const CheckboxInput = styled.input.attrs({
  type: 'checkbox'
})`
  position: absolute;
  z-index: -1;
  opacity: 0;
`;

const CheckboxIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  margin-top: -2px;
  border-radius: 2px;
  background: #E6E6F7;

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
    content: '';
    position: absolute;
    display: none;
    left: 8px;
    top: 4px;
    width: 3px;
    height: 8px;
    border solid: #FFFFFF;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);

    ${Control} input:disabled ~ &,
    ${Control} input:checked ~ & {
      display: block;
    }

    ${Control} & {
      left: 8px;
      top: 4px;
      width: 5px;
      height: 10px;
      border: solid #FFFFFF;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }
`;

const CheckboxLabel = styled.span`
  margin-left: 5px;
  font-weight: ${props => (props.bold ? 600 : 400)};
  color: #2e2e34;
`;

type Props = {
  name :string,
  label :string,
  value :string,
  checked :boolean,
  onChange :(event :Object) => void,
  disabled? :boolean,
  dataSection? :?string,
  bold? :string,
  noMargin? :boolean
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
