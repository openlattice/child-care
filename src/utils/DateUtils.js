// @flow
import moment from 'moment';
import { DateTime, Interval } from 'luxon';

import { getValue } from './DataUtils';
import { DAY_PTS } from './DataConstants';
import { PROPERTY_TYPES } from './constants/DataModelConstants';

const getAgeFromIsoDate = (dob :string = '', asNumber :boolean = false, invalidValue :any = '') => {
  const dobDT = DateTime.fromISO(dob);
  if (dobDT.isValid) {
    const now = DateTime.local();
    const age = Math.floor(Interval.fromDateTimes(dobDT, now).length('years'));

    return asNumber ? age : `${age}`;
  }

  return invalidValue;
};

const getDateShortFromIsoDate = (dob :string = '', invalidValue :string = '') :string => {
  const dobDT = DateTime.fromISO(dob);
  if (dobDT.isValid) {
    return dobDT.toLocaleString(DateTime.DATE_SHORT);
  }

  return invalidValue;
};

const isNowValid = (start :string, end :string) => {
  const startDT = DateTime.fromISO(start);
  const endDT = DateTime.fromISO(end);
  const now = DateTime.local();
  return (startDT < now) && (now < endDT);
};

export const getLastUpdatedDate = (date :string) => {
  const lastUpdatedDateTime = DateTime.fromISO(date);
  const today = DateTime.local();
  const yesterday = DateTime.local().minus({ days: 1 });
  let dateLabel = getDateShortFromIsoDate(date);
  if (lastUpdatedDateTime.hasSame(today, 'day')) dateLabel = 'Today';
  if (lastUpdatedDateTime.hasSame(yesterday, 'day')) dateLabel = 'Yesterday';
  return dateLabel;
};

const TIME_FORMAT = 'hh:mm:ss';

export const isOpen = (entity) => {
  const now = moment();
  const day = now.format('ddd');

  const [start, end] = DAY_PTS[day];

  if (getValue(entity, PROPERTY_TYPES.HOURS_UNKNOWN)) {
    return null;
  }

  const startVal = getValue(entity, start);
  const endVal = getValue(entity, end);

  if (!startVal || !endVal) {
    return false;
  }

  const startTime = moment(startVal).format(TIME_FORMAT);
  const endTime = moment(endVal).format(TIME_FORMAT);
  const currentTime = now.format(TIME_FORMAT);

  return currentTime.isBetween(startTime, endTime);
};

export {
  getAgeFromIsoDate,
  getDateShortFromIsoDate,
  isNowValid
};
