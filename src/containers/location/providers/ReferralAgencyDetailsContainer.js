// @flow
/* eslint-disable react/jsx-no-target-blank */
import React from 'react';

import { Typography } from 'lattice-ui-kit';
import { DataUtils } from 'lattice-utils';
import { useSelector } from 'react-redux';

import { Body3, TextLink } from '../../../components/layout';
import { PROVIDER_EMAIL, PROVIDER_PHONE_NUMBER } from '../../../core/tracking/constants';
import { trackLinkClick } from '../../../utils/AnalyticsUtils';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { LABELS } from '../../../utils/constants/labels';
import {
  DataRows,
  Row,
  StyledContentOuterWrapper,
  StyledContentWrapper,
  Wrapper
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

  let phoneElement = <Body3>{unknown}</Body3>;
  if (phone) {
    const trackPhoneClick = () => trackLinkClick(phone, PROVIDER_PHONE_NUMBER);
    phoneElement = <TextLink onClick={trackPhoneClick} href={`tel:${phone}`}>{phone}</TextLink>;
  }

  let emailElement = <Body3>{unknown}</Body3>;
  if (email) {
    const trackEmailClick = () => trackLinkClick(email, PROVIDER_EMAIL);
    emailElement = <TextLink onClick={trackEmailClick} href={`mailto:${email}`}>{email}</TextLink>;
  }

  return (
    <StyledContentOuterWrapper>
      <StyledContentWrapper>
        <Typography variant="subtitle2">{getText(LABELS.CONTACT)}</Typography>
        <Wrapper>
          <Row>
            <Body3>{getText(LABELS.PHONE)}</Body3>
            <DataRows>
              {phoneElement}
            </DataRows>
          </Row>

          <Row>
            <Body3>{getText(LABELS.EMAIL)}</Body3>
            <DataRows>
              {emailElement}
            </DataRows>
          </Row>
          <Row>
            <Body3>{getText(LABELS.ADDRESS)}</Body3>
            <DataRows>
              <span>{street}</span>
              <span>{`${city}, CA ${zip}`}</span>
            </DataRows>
          </Row>
        </Wrapper>
      </StyledContentWrapper>
    </StyledContentOuterWrapper>
  );
};

export default ProviderDetailsContainer;
