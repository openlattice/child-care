// @flow
/* eslint-disable react/jsx-no-target-blank */
import React from 'react';

import { useSelector } from 'react-redux';
import { DataUtils } from 'lattice-utils';

import { trackLinkClick } from '../../../utils/AnalyticsUtils';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { LABELS } from '../../../utils/constants/Labels';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import {
  DataRows,
  Line,
  Row,
  StyledContentOuterWrapper,
  StyledContentWrapper,
  TitleRow
} from '../../styled';

const { getPropertyValue } = DataUtils;

const { LOCATIONS } = STATE;
const { SELECTED_REFERRAL_AGENCY } = PROVIDERS;

const ProviderDetailsContainer = () => {
  const getText = useSelector(getTextFnFromState);
  const referralAgency = useSelector((store) => store.getIn([LOCATIONS, SELECTED_REFERRAL_AGENCY]));

  if (!referralAgency) {
    return null;
  }

  const city = getPropertyValue(referralAgency, [PROPERTY_TYPES.CITY, 0]);
  const email = getPropertyValue(referralAgency, [PROPERTY_TYPES.EMAIL, 0]);
  const phone = getPropertyValue(referralAgency, [PROPERTY_TYPES.PHONE, 0]);
  const street = getPropertyValue(referralAgency, [PROPERTY_TYPES.ADDRESS, 0]);
  const zip = getPropertyValue(referralAgency, [PROPERTY_TYPES.ZIP, 0]);

  const unknown = getText(LABELS.UNKNOWN);

  let phoneElement = <span>{unknown}</span>;
  if (phone) {
    const trackPhoneClick = () => trackLinkClick(phone, 'Provider Phone Number');
    phoneElement = <a onClick={trackPhoneClick} href={`tel:${phone}`}>{phone}</a>;
  }

  let emailElement = <span>{unknown}</span>;
  if (email) {
    const trackEmailClick = () => trackLinkClick(email, 'Provider Email');
    emailElement = <a onClick={trackEmailClick} href={`mailto:${email}`}>{email}</a>;
  }

  return (
    <StyledContentOuterWrapper>
      <StyledContentWrapper>
        <>
          <TitleRow>{getText(LABELS.CONTACT)}</TitleRow>
          <Row>
            <div>{getText(LABELS.PHONE)}</div>
            <DataRows>
              {phoneElement}
            </DataRows>
          </Row>

          <Row>
            <div>{getText(LABELS.EMAIL)}</div>
            <DataRows>
              {emailElement}
            </DataRows>
          </Row>
          <Row>
            <div>{getText(LABELS.ADDRESS)}</div>
            <DataRows>
              <span>{street}</span>
              <span>{`${city}, CA ${zip}`}</span>
            </DataRows>
          </Row>
        </>
        <Line />
      </StyledContentWrapper>
    </StyledContentOuterWrapper>
  );
};

export default ProviderDetailsContainer;