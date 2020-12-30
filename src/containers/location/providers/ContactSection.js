// @flow

import React from 'react';

import { DataUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import { useSelector } from 'react-redux';

import ExpandableSection from './ExpandableSection';

import { Body3, TextLink } from '../../../components/layout';
import { trackLinkClick } from '../../../utils/AnalyticsUtils';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { DAYS_OF_WEEK, DAY_PTS } from '../../../utils/DataConstants';
import { isProviderActive, shouldHideContact } from '../../../utils/DataUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { LABELS } from '../../../utils/constants/labels';
import {
  DataRows,
  DateRow,
  Row,
} from '../../styled';

const { LOCATIONS } = STATE;

const { getPropertyValue } = DataUtils;

const formatTime = (time) => {
  const dateTimeUTC = DateTime.fromISO(time, { zone: 'utc' });
  return dateTimeUTC.isValid ? dateTimeUTC.toFormat('t') : '?';
};

const ContactSection = () => {
  const getText = useSelector(getTextFnFromState);
  const provider = useSelector((store) => store.getIn([LOCATIONS, PROVIDERS.SELECTED_PROVIDER]));

  if (shouldHideContact(provider) || !isProviderActive(provider)) {
    return null;
  }

  const city = getPropertyValue(provider, [PROPERTY_TYPES.CITY, 0]);
  const email = getPropertyValue(provider, [PROPERTY_TYPES.EMAIL, 0]);
  const phone = getPropertyValue(provider, [PROPERTY_TYPES.PHONE, 0]);
  const street = getPropertyValue(provider, [PROPERTY_TYPES.ADDRESS, 0]);
  const zip = getPropertyValue(provider, [PROPERTY_TYPES.ZIP, 0]);

  const operatingHours = [];

  const unknown = getText(LABELS.UNKNOWN);

  let phoneElement = <Body3>{unknown}</Body3>;
  if (phone) {
    const trackPhoneClick = () => trackLinkClick(phone, 'Provider Phone Number');
    phoneElement = <TextLink onClick={trackPhoneClick} href={`tel:${phone}`}>{phone}</TextLink>;
  }

  let emailElement = <Body3>{unknown}</Body3>;
  if (email) {
    const trackEmailClick = () => trackLinkClick(email, 'Provider Email');
    emailElement = <TextLink onClick={trackEmailClick} href={`mailto:${email}`}>{email}</TextLink>;
  }

  if (getPropertyValue(provider, [PROPERTY_TYPES.HOURS_UNKNOWN, 0])) {
    operatingHours.push(<Body3 key="hours-unknown">{unknown}</Body3>);
  }
  else {
    // $FlowFixMe
    const days :string[] = Object.values(DAYS_OF_WEEK);
    days.forEach((day) => {
      const [startPT, endPT] = DAY_PTS[day];
      const start = getPropertyValue(provider, [startPT, 0]);
      const end = getPropertyValue(provider, [endPT, 0]);

      const timeWindowStr = (start || end) ? `${formatTime(start)} - ${formatTime(end)}` : 'Closed';

      if (start || end) {
        operatingHours.push(
          <DateRow key={day}>
            <Body3>{getText(LABELS[day])}</Body3>
            <Body3>{timeWindowStr}</Body3>
          </DateRow>
        );
      }
    });
  }

  if (!operatingHours.length) {
    operatingHours.push(<Body3 key="hours-unknown">{unknown}</Body3>);
  }

  return (
    <ExpandableSection title={getText(LABELS.CONTACT)}>
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
          <Body3>{street}</Body3>
          <Body3>{`${city}, CA ${zip}`}</Body3>
        </DataRows>
      </Row>

      <Row>
        <Body3>{getText(LABELS.OPERATING_HOURS)}</Body3>
        <DataRows>
          {operatingHours}
        </DataRows>
      </Row>
    </ExpandableSection>
  );
};

export default ContactSection;
