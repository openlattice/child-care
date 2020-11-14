// @flow

import React from 'react';

import styled from 'styled-components';
import { faChevronLeft } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Colors } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';

import BackButton from '../../../components/controls/BackButton';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { HEADER_HEIGHT, HEIGHTS } from '../../../core/style/Sizes';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { renderFacilityName } from '../../../utils/DataUtils';
import { LABELS } from '../../../utils/constants/Labels';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { selectReferralAgency } from '../LocationsActions';
import {
  Header,
  StyledHeaderOuterWrapper,
  StyledHeaderWrapper,
  SubHeader
} from '../../styled';

const { LOCATIONS } = STATE;

const { NEUTRAL, PURPLE } = Colors;

const ReferralAgencyHeaderContainer = () => {
  const getText = useSelector(getTextFnFromState);
  const selectedProvider = useSelector((store) => store.getIn([LOCATIONS, PROVIDERS.SELECTED_PROVIDER]));
  const selectedReferralAgency = useSelector((store) => store.getIn([LOCATIONS, PROVIDERS.SELECTED_REFERRAL_AGENCY]));
  const dispatch = useDispatch();

  const unselectReferralAgency = () => {
    dispatch(selectReferralAgency(false));
  };

  if (!selectedReferralAgency) {
    return null;
  }

  const selectedProviderName = renderFacilityName(selectedProvider, getText);
  const selectedAgencyName = renderFacilityName(selectedReferralAgency, getText);

  const typeLabel = getText(LABELS.RESOURCE_AND_REFERRAL);

  return (
    <StyledHeaderOuterWrapper>
      <StyledHeaderWrapper padding="25px">
        <BackButton onClick={unselectReferralAgency}>
          <FontAwesomeIcon icon={faChevronLeft} />
          <span>{selectedProviderName}</span>
        </BackButton>
        <Header>
          <div>{selectedAgencyName}</div>
        </Header>
        <SubHeader>{typeLabel}</SubHeader>
      </StyledHeaderWrapper>
    </StyledHeaderOuterWrapper>
  );
};

export default ReferralAgencyHeaderContainer;
