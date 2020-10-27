import React from 'react';
import { faSearch } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import styled, { css } from 'styled-components';

const style = css`
  display: flex;
  flex: 0 1 auto;
  width: ${(props) => props.width || '100%'};
  height: ${(props) => (props.short ? 39 : 45)}px;
  font-size: 16px;
  line-height: 19px;
  border-radius: 3px;
  background-color: #f9f9fd;
  border: solid 1px #dcdce7;
  color: #2e2e34;
  padding: 12px 20px;
  margin-bottom: ${(props) => (props.padBottom ? 20 : 0)}px;

  &:focus {
    box-shadow: inset 0 0 0 1px rebeccapurple;
    outline: none;
    background-color: #ffffff;
  }

  &::placeholder {
    color: #8e929b;
  }

  &:disabled {
    border-radius: 3px;
    background-color: #f9f9fd;
    border: solid 1px #dcdce7;
    color: #8e929b;
    font-weight: normal;
    cursor: default;
  }
`;

const StyledInput = styled.input`${style}`;
export const StyledTextArea = styled.textarea`
  ${style}
  height: 100px !important;
`;

export default StyledInput;

/* Styled input with FontAwesome search icon */

const InputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PaddedStyledInput = styled(StyledInput)`
  padding-left: 35px;
  width: 100%;
`;

const SearchIcon = styled(FontAwesomeIcon).attrs({
  icon: faSearch
})`
  position: absolute;
  left: 10px;
  height: 100%;
  top: 0;
  bottom: 0;
`;
/* eslint-disable */
export const SearchInput = (props) => (
  <InputWrapper>
    <SearchIcon />
    <PaddedStyledInput {...props} />
  </InputWrapper>
);
