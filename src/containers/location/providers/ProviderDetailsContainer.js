// @flow
/* eslint-disable react/jsx-no-target-blank */
import React from 'react';

import { useSelector } from 'react-redux';

import CapacitySection from './CapacitySection';
import ContactSection from './ContactSection';
import FamilyHomeLocationSection from './FamilyHomeLocationSection';
import HealthAndSafetySection from './HealthAndSafetySection';
import ResourceAndReferralSection from './ResourceAndReferralSection';
import VacancySection from './VacancySection';

import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { StyledContentOuterWrapper, StyledContentWrapper } from '../../styled';

const { LOCATIONS } = STATE;
const { SELECTED_PROVIDER } = PROVIDERS;

const ProviderDetailsContainer = () => {
  const provider = useSelector((store) => store.getIn([LOCATIONS, SELECTED_PROVIDER]));

  return provider && (
    <StyledContentOuterWrapper>
      <StyledContentWrapper>
        <FamilyHomeLocationSection />
        <VacancySection />
        <CapacitySection />
        <ContactSection />
        <HealthAndSafetySection />
        <ResourceAndReferralSection />
      </StyledContentWrapper>
    </StyledContentOuterWrapper>
  );
};

export default ProviderDetailsContainer;
