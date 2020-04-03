// @flow

import React from 'react';

import styled from 'styled-components';
import { faFileTimes } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { PURPLE } from '../shared/Colors';

const ErrorWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: normal;

  div {
    max-width: 750px;
    text-align: center;
  }
`;


type Props = {
  message :string;
}

const DEFAULT_MESSAGE = 'The resource you requested could not be found.';

const NoResource = ({ message = DEFAULT_MESSAGE } :Props) => (
  <ErrorWrapper>
    <FontAwesomeIcon color={PURPLE} icon={faFileTimes} size="5x" />
    <div>{message}</div>
  </ErrorWrapper>
);

export default NoResource;
