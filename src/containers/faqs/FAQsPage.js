/*
 * @flow
 */
import React from 'react';

import styled from 'styled-components';
import { Colors, Typography } from 'lattice-ui-kit';
import { useSelector } from 'react-redux';

import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';
import { getTextFnFromState } from '../../utils/AppUtils';
import { FAQS, Q_AND_A } from '../../utils/constants/labels';

const { PURPLE } = Colors;

const Wrapper = styled(ContentWrapper)`
  padding: 30px !important;
  background-color: white;

  h6 {
    margin: 20px 0 5px;
  }
`;

const SubTitle = styled(Typography)`
  color: ${PURPLE.P300};
  text-decoration: underline;
`;

const Question = styled(Typography)`
  margin-bottom: 8px;
`;

const Answer = styled(Typography)`
  margin-bottom: 16px;
`;

const getQAndAs = (getText) => Object.entries(FAQS).map(([key, value]) => (
  Q_AND_A[key] && (
    <>
      <SubTitle variant="h6">{getText(value)}</SubTitle>
      {
        Q_AND_A[key].map(({ Q, A }) => (
          <>
            <Question variant="body2">{getText(Q)}</Question>
            <Answer variant="body1">{getText(A)}</Answer>
          </>
        ))
      }
    </>
  )
));

const ResourcesPage = () => {

  const getText = useSelector(getTextFnFromState);

  return (
    <ContentOuterWrapper>
      <Wrapper>
        <Typography variant="h3">{getText(FAQS.FAQS_TITLE)}</Typography>
        <Typography color="textSecondary" variant="body1">{getText(FAQS.FAQS_SUBTITLE)}</Typography>
        { getQAndAs(getText) }
      </Wrapper>
    </ContentOuterWrapper>
  );
};

export default ResourcesPage;
