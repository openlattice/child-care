/*
 * @flow
 */
import React from 'react';

import styled from 'styled-components';
import { Typography } from 'lattice-ui-kit';
import { useSelector } from 'react-redux';

import { ContentOuterWrapper, ContentWrapper, TextLink } from '../../components/layout';
import { trackLinkClick } from '../../utils/AnalyticsUtils';
import { getTextFnFromState } from '../../utils/AppUtils';
import { LABELS } from '../../utils/constants/Labels';
import { RESOURCES, SUBTITLES } from '../../utils/constants/ResourcesConstants';

const {
  CALIFORNIA_RESOURCE_AND_REFERRAL_NETWORK,
  CALIFORNIA_COVID19_CHILDCARE_RESPONSE,
  CALIFORNIA_PARENT_AND_FAMILY_RESOURCES,
  FAMILY_CHILD_CARE_HOME_LICENSING_INFORMATION,
} = SUBTITLES;

const Wrapper = styled(ContentWrapper)`
  padding: 30px !important;
  background-color: white;

  h6 {
    margin: 20px 0 5px;
  }
`;

const ResourcesPage = () => {

  const getText = useSelector(getTextFnFromState);

  const trackClick = (link, title) => trackLinkClick(link, title);

  return (
    <ContentOuterWrapper>
      <Wrapper>
        <Typography variant="h1">{getText(LABELS.RESOURCES)}</Typography>
        <Typography color="textSecondary" variant="body1">{getText(LABELS.RESOURCES_DESCRIPTIONS)}</Typography>
        <Typography variant="subtitle1">{CALIFORNIA_RESOURCE_AND_REFERRAL_NETWORK}</Typography>
        <TextLink
            aria-label={`phone to ${CALIFORNIA_RESOURCE_AND_REFERRAL_NETWORK}`}
            href={`tel:${RESOURCES[CALIFORNIA_RESOURCE_AND_REFERRAL_NETWORK]}`}
            onClick={() => trackClick(
              RESOURCES[CALIFORNIA_RESOURCE_AND_REFERRAL_NETWORK],
              CALIFORNIA_RESOURCE_AND_REFERRAL_NETWORK
            )}>
          {RESOURCES[CALIFORNIA_RESOURCE_AND_REFERRAL_NETWORK]}
        </TextLink>
        <Typography variant="subtitle1">{CALIFORNIA_COVID19_CHILDCARE_RESPONSE}</Typography>
        <TextLink
            aria-label={`link to ${CALIFORNIA_COVID19_CHILDCARE_RESPONSE}`}
            href={RESOURCES[CALIFORNIA_COVID19_CHILDCARE_RESPONSE]}
            key={RESOURCES[CALIFORNIA_COVID19_CHILDCARE_RESPONSE]}
            onClick={() => trackClick(
              RESOURCES[CALIFORNIA_COVID19_CHILDCARE_RESPONSE],
              CALIFORNIA_COVID19_CHILDCARE_RESPONSE
            )}
            target="_blank">
          {RESOURCES[CALIFORNIA_COVID19_CHILDCARE_RESPONSE]}
        </TextLink>
        <Typography variant="subtitle1">{CALIFORNIA_PARENT_AND_FAMILY_RESOURCES}</Typography>
        <TextLink
            aria-label={`link to ${CALIFORNIA_PARENT_AND_FAMILY_RESOURCES}`}
            href={RESOURCES[CALIFORNIA_PARENT_AND_FAMILY_RESOURCES]}
            key={RESOURCES[CALIFORNIA_PARENT_AND_FAMILY_RESOURCES]}
            onClick={() => trackClick(
              RESOURCES[CALIFORNIA_PARENT_AND_FAMILY_RESOURCES],
              CALIFORNIA_PARENT_AND_FAMILY_RESOURCES
            )}
            target="_blank">
          {RESOURCES[CALIFORNIA_PARENT_AND_FAMILY_RESOURCES]}
        </TextLink>
        <Typography variant="subtitle1">{FAMILY_CHILD_CARE_HOME_LICENSING_INFORMATION}</Typography>
        <TextLink
            aria-label={`link to ${FAMILY_CHILD_CARE_HOME_LICENSING_INFORMATION}`}
            href={RESOURCES[FAMILY_CHILD_CARE_HOME_LICENSING_INFORMATION]}
            key={RESOURCES[FAMILY_CHILD_CARE_HOME_LICENSING_INFORMATION]}
            onClick={() => trackClick(
              RESOURCES[FAMILY_CHILD_CARE_HOME_LICENSING_INFORMATION],
              FAMILY_CHILD_CARE_HOME_LICENSING_INFORMATION
            )}
            target="_blank">
          {RESOURCES[FAMILY_CHILD_CARE_HOME_LICENSING_INFORMATION]}
        </TextLink>
      </Wrapper>
    </ContentOuterWrapper>
  );
};

export default ResourcesPage;
