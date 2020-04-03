// @flow

import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/pro-solid-svg-icons';

import LinkButton from './LinkButton';

const EditButton = styled(LinkButton)`
  color: inherit;
  background-color: inherit;
  padding: 2px;
`;

type Props = {
  disabled ? :boolean;
  isLoading ? :boolean;
  mode ? :string;
  state ? :any;
  to :string;
}

const EditLinkButton = (props :Props) => {
  const {
    disabled,
    isLoading,
    mode,
    state,
    to,
  } = props;
  return (
    <EditButton
        disabled={disabled}
        isLoading={isLoading}
        mode={mode}
        state={state}
        to={to}>
      <FontAwesomeIcon icon={faEdit} fixedWidth />
    </EditButton>
  );
};

EditLinkButton.defaultProps = {
  disabled: false,
  isLoading: false,
  mode: undefined,
  state: undefined,
};

export default EditLinkButton;
