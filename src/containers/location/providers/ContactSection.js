// @flow

import React from 'react';

import { DataUtils } from 'lattice-utils';
import { DateTime } from 'luxon';
import { useSelector } from 'react-redux';

import ExpandableSection from './ExpandableSection';

import { trackLinkClick } from '../../../utils/AnalyticsUtils';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { DAYS_OF_WEEK, DAY_PTS } from '../../../utils/DataConstants';
import { isProviderActive, shouldHideContact } from '../../../utils/DataUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { LABELS } from '../../../utils/constants/Labels';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import {
  DataRows,
  DateRow,
  Row,
} from '../../styled';

const { LOCATIONS } = STATE;

const { getPropertyValue } = DataUtils;

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

  const formatTime = (time) => {
    if (!time) {
      return '?';
    }

    const withDate = DateTime.fromISO(time, { zone: 'utc' });
    if (!withDate.isValid) {
      return '?';
    }

    return withDate.toLocaleString(DateTime.TIME_SIMPLE);
  };

  const operatingHours = [];

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

  if (getPropertyValue(provider, [PROPERTY_TYPES.HOURS_UNKNOWN, 0])) {
    operatingHours.push(<span key="hours-unknown">{unknown}</span>);
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
            <span>{getText(LABELS[day])}</span>
            <span>{timeWindowStr}</span>
          </DateRow>
        );
      }
    });
  }

  if (!operatingHours.length) {
    operatingHours.push(<span key="hours-unknown">{unknown}</span>);
  }

  return (
    <ExpandableSection title={getText(LABELS.CONTACT)}>
      <>
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

        <Row>
          <div>{getText(LABELS.OPERATING_HOURS)}</div>
          <DataRows>
            {operatingHours}
          </DataRows>
        </Row>
      </>
    </ExpandableSection>
  );
};

export default ContactSection;
