// @flow
import React from 'react';

import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';

import { MEDIA_QUERY_LG, MEDIA_QUERY_MD } from '../../core/style/Sizes';
import {
  BLACK,
  INVALID_BACKGROUND,
  INVALID_TAG,
} from '../../shared/Colors';

const { RED_1 } = Colors;


export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  background: #fff;
  padding: 10px;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.1);

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    padding: 15px;
  }

  @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
    padding: 20px;
  }
`;

export const FormSection = styled.div`
  align-items: flex-start;
  background-color: ${(props) => (props.invalid ? `${INVALID_BACKGROUND}` : 'transparent')};
  display: flex;
  flex-direction: column;
  margin: ${(props) => ((props.noMargin && !props.invalid) ? '0' : '10px')} -10px 0 -10px;
  padding: ${(props) => (props.invalid ? '5px 10px 5px 10px' : '0 10px')};
  width: 100%;
`;

const ErrorMessage = styled.span`
  width: 100%;
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: ${INVALID_TAG};
`;

export const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  color: ${BLACK};

  h1 {
    margin-bottom: 0;
    font-weight: 600;
    font-size: 18px;
  }

  span {
    font-weight: 400;
    font-size: 14px;
  }
`;

export const IndentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding-left: 30px;
  width: 100%;
`;


const RequiredFieldWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-spart;
  align-items: flex-start;

  ::after {
    content: '*';
    color: ${RED_1};
  }
`;

export const RequiredField = ({ children } :any) => (
  <RequiredFieldWrapper>
    <span>{children}</span>
  </RequiredFieldWrapper>
);

export const FormSectionWithValidation = ({
  children,
  errorMessage,
  invalid,
  noMargin
} :any) => (
  <FormSection invalid={invalid} noMargin={noMargin}>
    {invalid ? <ErrorMessage>{errorMessage || 'This is a required field.'}</ErrorMessage> : null}
    {children}
  </FormSection>
);
