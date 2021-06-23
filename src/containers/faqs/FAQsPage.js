/*
 * @flow
 */
import React from 'react';

import styled from 'styled-components';
import { Colors, Typography } from 'lattice-ui-kit';
import { useSelector } from 'react-redux';

import { ContentOuterWrapper, ContentWrapper, TextLink } from '../../components/layout';
import { getTextFnFromState } from '../../utils/AppUtils';
import { FAQS, Q_AND_A, REGIONAL_OFFICE_CONTACTS_URL } from '../../utils/constants/labels';
import { trackLinkClick } from '../../utils/AnalyticsUtils';

const { BLUE } = Colors;

const trackClick = (link, title) => trackLinkClick(link, title);

const Wrapper = styled(ContentWrapper)`
  background-color: white;
  padding: 30px 30px 60px !important;

  h5 {
    margin: 20px 0 5px;
  }
`;

const TextLinkWithMargin = styled(TextLink)`
  margin-bottom: 10px;
`;

const WhiteSpaceWrapper = styled(Typography)`
  white-space: pre-wrap;
`;

const SubTitle = styled(Typography)`
  color: ${BLUE.B400};
  text-decoration: underline;
`;

const Question = styled(Typography)`
  margin-bottom: 8px;
`;

const Answer = styled(Typography)`
  margin-bottom: 16px;
`;

const ListAnswer = styled.ul`
  margin: 5px 0 10px;
`;

const getQAndAs = (getText) => Object.entries(FAQS).map(([key, value]) => (
  Q_AND_A[key] && (
    <>
      <SubTitle variant="h5">{getText(value)}</SubTitle>
      {
        Q_AND_A[key].map(({ Q, A }) => (
          <>
            <Question variant="body2" dangerouslySetInnerHTML={{ __html: getText(Q) }} />
            <Answer variant="body1" dangerouslySetInnerHTML={{ __html: getText(A) }} />
          </>
        ))
      }
    </>
  )
));

const FAQsPage = () => {

  const getText = useSelector(getTextFnFromState);

  return (
    <ContentOuterWrapper>
      <Wrapper>
        <Typography paragraph variant="h3">{getText(FAQS.FAQS_TITLE)}</Typography>
        <Typography paragraph color="textSecondary" variant="body1">{getText(FAQS.FAQS_SUBTITLE)}</Typography>
        <SubTitle paragraph variant="h5">{getText(FAQS.COMPLAINT_HOTLINE_TITLE)}</SubTitle>
        <WhiteSpaceWrapper paragraph variant="body1">{getText(FAQS.COMPLAINT_HOTLINE_SUBTITLE)}</WhiteSpaceWrapper>
        <WhiteSpaceWrapper paragraph variant="subtitle1">{getText(FAQS.COMPLAINT_HOTLINE_CONTACT)}</WhiteSpaceWrapper>
        <Typography paragraph variant="body1">{getText(FAQS.COMPLAINT_HOTLINE_BLOCK_1)}</Typography>
        <Question variant="body2">{getText(FAQS.COMPLAINT_HOTLINE_QUESTION_1)}</Question>
        <ListAnswer>
          {
            getText(FAQS.COMPLAINT_HOTLINE_ANSWER_1).map(((answer) => <li>{answer}</li>))
          }
        </ListAnswer>
        <Typography paragraph variant="body1">{getText(FAQS.COMPLAINT_HOTLINE_BLOCK_2)}</Typography>
        <TextLinkWithMargin
            aria-label={`link to ${REGIONAL_OFFICE_CONTACTS_URL}`}
            href={REGIONAL_OFFICE_CONTACTS_URL}
            onClick={() => trackClick(
              REGIONAL_OFFICE_CONTACTS_URL,
              getText(FAQS.REGIONAL_OFFICE_CONTACTS)
            )}
            target="_blank">
          {getText(FAQS.REGIONAL_OFFICE_CONTACTS)}
        </TextLinkWithMargin>
        <Question variant="body2">{getText(FAQS.COMPLAINT_HOTLINE_QUESTION_2)}</Question>
        <ListAnswer>
          {
            getText(FAQS.COMPLAINT_HOTLINE_ANSWER_2).map(((answer) => <li>{answer}</li>))
          }
        </ListAnswer>
        { getQAndAs(getText) }
      </Wrapper>
    </ContentOuterWrapper>
  );
};

export default FAQsPage;
