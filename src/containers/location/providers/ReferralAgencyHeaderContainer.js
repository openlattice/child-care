// @flow

import React from 'react';

import { faChevronLeft } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useDispatch, useSelector } from 'react-redux';

import BackButton from '../../../components/controls/BackButton';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { renderFacilityName } from '../../../utils/DataUtils';
import { LABELS } from '../../../utils/constants/labels';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { selectReferralAgency } from '../LocationsActions';
import {
  Header,
  StyledHeaderOuterWrapper,
  StyledHeaderWrapper,
  SubHeader
} from '../../styled';

const { LOCATIONS } = STATE;

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

  const selectedProviderName = selectedProvider
    ? renderFacilityName(selectedProvider, getText)
    : getText(LABELS.BACK_TO_SEARCH_RESULTS);
  const selectedAgencyName = renderFacilityName(selectedReferralAgency, getText);

  const typeLabel = getText(LABELS.REFERRAL);

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
