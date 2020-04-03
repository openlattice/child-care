/*
 * @flow
 */

import React from 'react';

import styled, { css } from 'styled-components';

const ToolbarWrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin-bottom: ${(props) => (props.noPadding ? 0 : '20px')};
`;

const hoverStyles = ({ selected, styles } :any) => {

  if (!selected) {
    return css`
        color: ${styles.hoverColor};
        background-color: ${styles.hoverBackgroundColor};
      `;
  }
  return '';
};

const StyledButton = styled.button`
  display: flex;
  justify-content: center;
  border-top: 1px solid ${(props) => props.styles.border};
  border-bottom: 1px solid ${(props) => props.styles.border};
  border-right: 1px solid ${(props) => props.styles.border};
  text-decoration: none;
  padding: ${(props) => props.styles.padding};
  min-width: 130px;
  font-size: 12px;
  font-weight: ${(props) => (props.selected ? 600 : props.styles.defaultFontWeight)};
  background-color: ${(props) => (props.selected ? props.styles.selectedBackgroundColor : 'transparent')};
  color: ${(props) => (props.selected ? props.styles.selectedTextColor : '#8e929b')};

  &:hover {
    cursor: pointer;
    ${hoverStyles};
  }

  &:focus {
    outline: none;
  }

  &:first-child {
    border-radius: 4px 0 0 4px;
    border-left: 1px solid ${(props) => props.styles.border};
  }

  &:last-child {
    border-radius: 0 4px 4px 0;
  }
`;

type SearchOption = {
  onClick :() => void,
  value :string,
  label :string
};

type Props = {
  options :SearchOption[],
  value :string,
  noPadding? :boolean,
  isBasic? :boolean
}

const APPEARANCES = {
  DEFAULT: 'DEFAULT',
  BASIC: 'BASIC'
};

const getColors = (appearance) => {
  switch (appearance) {
    case APPEARANCES.BASIC: {
      return {
        border: '#dcdce7',
        selectedTextColor: '#8e929b',
        padding: '6px 15px',
        selectedBackgroundColor: '#dcdce7',
        defaultFontWeight: '400',
        hoverColor: '#8e929b',
        hoverBackgroundColor: '#f0f0f7'
      };
    }
    case APPEARANCES.DEFAULT:
    default:
      return {
        border: '#ceced9',
        padding: '10px 50px',
        selectedTextColor: '#fff',
        selectedBackgroundColor: '#6124e2',
        defaultFontWeight: '600',
        hoverColor: '#6124e2',
        hoverBackgroundColor: '#e4d8ff'
      };
  }
};

const ButtonToolbar = ({
  options,
  value,
  noPadding,
  isBasic
} :Props) => {
  const appearance = isBasic ? APPEARANCES.BASIC : APPEARANCES.DEFAULT;
  return (
    <ToolbarWrapper noPadding={noPadding} styles={getColors(appearance)}>
      { options.map((option) => (
        <StyledButton
            key={option.value}
            onClick={option.onClick}
            styles={getColors(appearance)}
            selected={option.value === value}>
          {option.label}
        </StyledButton>
      )) }
    </ToolbarWrapper>
  );
};

ButtonToolbar.defaultProps = {
  noPadding: false,
  isBasic: false
};

export default ButtonToolbar;
