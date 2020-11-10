// @flow

import React from 'react';

import styled from 'styled-components';
import { faChevronLeft } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Colors } from 'lattice-ui-kit';
import { useSelector, useDispatch } from 'react-redux';

import { selectReferralAgency } from '../LocationsActions';
import { ContentOuterWrapper, ContentWrapper } from '../../../components/layout';
import { HEADER_HEIGHT, HEIGHTS } from '../../../core/style/Sizes';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { renderFacilityName } from '../../../utils/DataUtils';
import { LABELS } from '../../../utils/constants/Labels';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';

const { LOCATIONS } = STATE;

const { NEUTRAL, PURPLE } = Colors;

const StyledContentOuterWrapper = styled(ContentOuterWrapper)`
  position: fixed;
  top: ${HEADER_HEIGHT}px;
  z-index: 1;
`;

const StyledContentWrapper = styled(ContentWrapper)`
  background-color: white;
  position: relative;

  @media only screen and (min-height: ${HEIGHTS[0]}px) {
    padding: 10px 25px;
  }

  @media only screen and (min-height: ${HEIGHTS[1]}px) {
    padding: 25px;
  }
`;

const BackButton = styled.div`
  align-items: center;
  color: ${PURPLE.P300};
  display: flex;
  flex-direction: row;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }

  span {
    margin-left: 15px;
  }

  &:hover {
    cursor: pointer;
  }
`;

const Header = styled.div`
  align-items: center;
  color: ${NEUTRAL.N700};
  display: flex;
  flex-direction: row;
  font-style: normal;
  justify-content: space-between;

  @media only screen and (min-height: ${HEIGHTS[0]}px) {
    padding: 10px 0;
  }

  @media only screen and (min-height: ${HEIGHTS[1]}px) {
    padding: 15px 0;
  }

  div {
    @media only screen and (min-height: ${HEIGHTS[0]}px) {
      font-size: 18px;
      line-height: 14px;
    }

    @media only screen and (min-height: ${HEIGHTS[1]}px) {
      font-size: 22px;
      line-height: 27px;
    }

    font-weight: 600;
  }

  span {
    font-size: 14px;
    font-weight: normal;
    line-height: 17px;
    min-width: fit-content;
  }
`;

const SubHeader = styled.div`
  color: ${NEUTRAL.N700};
  display: flex;
  font-size: 14px;
  font-style: normal;
  font-weight: normal;
  justify-content: space-between;
  line-height: 17px;
  margin: 3px 0;
`;

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
    <StyledContentOuterWrapper>
      <StyledContentWrapper padding="25px">
        <BackButton onClick={unselectReferralAgency}>
          <FontAwesomeIcon icon={faChevronLeft} />
          <span>{selectedProviderName}</span>
        </BackButton>
        <Header>
          <div>{selectedAgencyName}</div>
        </Header>
        <SubHeader>{typeLabel}</SubHeader>
      </StyledContentWrapper>
    </StyledContentOuterWrapper>
  );
};

export default ReferralAgencyHeaderContainer;
