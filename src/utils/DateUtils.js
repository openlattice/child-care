// @flow
import { DateTime, Interval } from 'luxon';

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

export {
  getAgeFromIsoDate,
  getDateShortFromIsoDate,
  isNowValid
};
