/*
 * @flow
 */
import React, { Fragment } from 'react';

import styled from 'styled-components';
import { Typography } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';

import { ContentOuterWrapper, ContentWrapper, TextLink } from '../../components/layout';
import { trackLinkClick } from '../../utils/AnalyticsUtils';
import { getTextFnFromState } from '../../utils/AppUtils';
import { goToPath } from '../../core/router/RoutingActions';
import { FAQS_PATH } from '../../core/router/Routes';
import { FAQS, LABELS, RESOURCES } from '../../utils/constants/labels';
import { RESOURCES_CONTENT } from '../../utils/constants/ResourcesConstants';

const Wrapper = styled(ContentWrapper)`
  padding: 30px !important;
  background-color: white;

  h6 {
    margin: 20px 0 5px;
  }
`;

const trackClick = (link, title) => trackLinkClick(link, title);
const getResourcesContent = (getText) => Object.entries(RESOURCES).map(([key, value]) => (
  RESOURCES_CONTENT[key] && (
    <Fragment key={key}>
      <Typography variant="subtitle1">{getText(value)}</Typography>
      {
        RESOURCES_CONTENT[key].PHONE && (
          <TextLink
              aria-label={`phone to ${getText(value)}`}
              href={`tel:${RESOURCES_CONTENT[key].PHONE}`}
              onClick={() => trackClick(
                RESOURCES_CONTENT[key].PHONE,
                getText(value)
              )}>
            {RESOURCES_CONTENT[key].PHONE}
          </TextLink>
        )
      }
      {
        RESOURCES_CONTENT[key].URL && (
          <TextLink
              aria-label={`link to ${getText(value)}`}
              href={RESOURCES_CONTENT[key].URL}
              onClick={() => trackClick(
                RESOURCES_CONTENT[key].URL,
                getText(value)
              )}
              target="_blank">
            {RESOURCES_CONTENT[key].URL}
          </TextLink>
        )
      }
    </Fragment>
  )
));

const ResourcesPage = () => {
  const dispatch = useDispatch();
  const getText = useSelector(getTextFnFromState);
  const goToFAQs = () => dispatch(goToPath(FAQS_PATH));

  return (
    <ContentOuterWrapper>
      <Wrapper>
        <Typography variant="h1">{getText(RESOURCES.RESOURCES)}</Typography>
        <Typography color="textSecondary" variant="body1">{getText(RESOURCES.RESOURCES_DESCRIPTIONS)}</Typography>
        { getResourcesContent(getText) }
        <Typography variant="subtitle1">{getText(FAQS.FREQUENTLY_ASKED_QUESTIONS)}</Typography>
        <TextLink
            aria-label="link to FAQs Page"
            onClick={goToFAQs}>
          {getText(LABELS.LINK_TO_FAQS)}
        </TextLink>
      </Wrapper>
    </ContentOuterWrapper>
  );
};

export default ResourcesPage;
