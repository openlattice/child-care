// @flow
/* eslint-disable react/jsx-no-target-blank */
import React, { Fragment } from 'react';

import { useSelector } from 'react-redux';

import CapacitySection from './CapacitySection';
import ContactSection from './ContactSection';
import FamilyHomeLocationSection from './FamilyHomeLocationSection';
import HealthAndSafetySection from './HealthAndSafetySection';
import ResourceAndReferralSection from './ResourceAndReferralSection';
import VacancySection from './VacancySection';

import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { Line, StyledContentOuterWrapper, StyledContentWrapper } from '../../styled';

const { LOCATIONS } = STATE;
const { SELECTED_PROVIDER } = PROVIDERS;

const ProviderDetailsContainer = () => {
  const provider = useSelector((store) => store.getIn([LOCATIONS, SELECTED_PROVIDER]));

  if (!provider) {
    return null;
  }

  const sections = [
    <FamilyHomeLocationSection />,
    <VacancySection />,
    <CapacitySection />,
    <ContactSection />,
    <HealthAndSafetySection />,
    <ResourceAndReferralSection />
  ].filter((s) => s).map((s, idx) => (
    /* eslint-disable-next-line */
    <Fragment key={idx}>
      {s}
      <Line />
    </Fragment>
  ));

  return (
    <StyledContentOuterWrapper>
      <StyledContentWrapper>
        {sections}
      </StyledContentWrapper>
    </StyledContentOuterWrapper>
  );
};

export default ProviderDetailsContainer;
