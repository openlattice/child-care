/*
 * @flow
 */
import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Colors, Typography } from 'lattice-ui-kit';

import { RESOURCES, SUBTITLES } from '../../utils/constants/ResourcesConstants';
import { trackLinkClick } from '../../utils/AnalyticsUtils';
import { STATE } from '../../utils/constants/StateConstants';
import { LABELS } from '../../utils/constants/Labels';
import { getRenderTextFn } from '../../utils/AppUtils';
import { ContentOuterWrapper, ContentWrapper } from '../../components/layout';

const { NEUTRAL, PURPLE } = Colors;

const {
  CALIFORNIA_RESOURCE_AND_REFERRAL_NETWORK,
  CALIFORNIA_COVID19_CHILDCARE_RESPONSE,
  CALIFORNIA_PARENT_AND_FAMILY_RESOURCES,
  FAMILY_CHILD_CARE_HOME_LICENSING_INFORMATION,
} = SUBTITLES;

const Wrapper = styled(ContentWrapper)`
  padding: 30px !important;
  background-color: white;

  a {
    color: ${PURPLE.P300};
  }

  h6 {
    margin: 20px 0 5px;
  }
`;

const Description = styled(Typography)`
  color: ${NEUTRAL.N500};
`;

type Props = {
  renderText :(currentLanguage :string) => string;
}

const AboutPage = ({ renderText } :Props) => {

  const trackClick = (link, title) => trackLinkClick(link, title);

  return (
    <ContentOuterWrapper>
      <Wrapper>
        <Typography variant="h1">{renderText(LABELS.RESOURCES)}</Typography>
        <Description variant="body1">{renderText(LABELS.RESOURCES_DESCRIPTIONS)}</Description>
        <Typography variant="subtitle1">{CALIFORNIA_RESOURCE_AND_REFERRAL_NETWORK}</Typography>
        <a
            onClick={() => trackClick(
              RESOURCES[CALIFORNIA_RESOURCE_AND_REFERRAL_NETWORK],
              CALIFORNIA_RESOURCE_AND_REFERRAL_NETWORK
            )}
            href={`tel:${RESOURCES[CALIFORNIA_RESOURCE_AND_REFERRAL_NETWORK]}`}>
          {RESOURCES[CALIFORNIA_RESOURCE_AND_REFERRAL_NETWORK]}
        </a>
        <Typography variant="subtitle1">{CALIFORNIA_COVID19_CHILDCARE_RESPONSE}</Typography>
        <a
            onClick={() => trackClick(
              RESOURCES[CALIFORNIA_COVID19_CHILDCARE_RESPONSE],
              CALIFORNIA_COVID19_CHILDCARE_RESPONSE
            )}
            key={RESOURCES[CALIFORNIA_COVID19_CHILDCARE_RESPONSE]}
            href={RESOURCES[CALIFORNIA_COVID19_CHILDCARE_RESPONSE]}
            target="_blank">
          {RESOURCES[CALIFORNIA_COVID19_CHILDCARE_RESPONSE]}
        </a>
        <Typography variant="subtitle1">{CALIFORNIA_PARENT_AND_FAMILY_RESOURCES}</Typography>
        <a
            onClick={() => trackClick(
              RESOURCES[CALIFORNIA_PARENT_AND_FAMILY_RESOURCES],
              CALIFORNIA_PARENT_AND_FAMILY_RESOURCES
            )}
            key={RESOURCES[CALIFORNIA_PARENT_AND_FAMILY_RESOURCES]}
            href={RESOURCES[CALIFORNIA_PARENT_AND_FAMILY_RESOURCES]}
            target="_blank">
          {RESOURCES[CALIFORNIA_PARENT_AND_FAMILY_RESOURCES]}
        </a>
        <Typography variant="subtitle1">{FAMILY_CHILD_CARE_HOME_LICENSING_INFORMATION}</Typography>
        <a
            onClick={() => trackClick(
              RESOURCES[FAMILY_CHILD_CARE_HOME_LICENSING_INFORMATION],
              FAMILY_CHILD_CARE_HOME_LICENSING_INFORMATION
            )}
            key={RESOURCES[FAMILY_CHILD_CARE_HOME_LICENSING_INFORMATION]}
            href={RESOURCES[FAMILY_CHILD_CARE_HOME_LICENSING_INFORMATION]}
            target="_blank">
          {RESOURCES[FAMILY_CHILD_CARE_HOME_LICENSING_INFORMATION]}
        </a>
      </Wrapper>
    </ContentOuterWrapper>
  );
}

function mapStateToProps(state) {
  const app = state.get(STATE.APP);

  return {
    app,
    renderText: getRenderTextFn(state)
  };
}
// $FlowFixMe
export default connect(mapStateToProps, null)(AboutPage);
