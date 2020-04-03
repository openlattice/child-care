import { OTHER } from '../../../utils/constants/CrisisReportConstants';

export const OFFICER_TRAINING = [
  'Officer with 40-hour CIT training',
  'Co-responder (mental health professional)'
];

export const DISPOSITIONS = {
  NOTIFIED_SOMEONE: 'Notified Someone',
  VERBAL_REFERRAL: 'Verbal Referral',
  COURTESY_TRANPORT: 'Courtesy Transport',
  HOSPITAL: 'Hospital',
  ADMINISTERED_DRUG: 'Administered naloxene or narcan',
  ARRESTABLE_OFFENSE: 'Arrestable offense',
  NO_ACTION_POSSIBLE: 'No action possible'
};

export const PEOPLE_NOTIFIED = [
  'Case Manager / MH agency notified',
  'Family member',
  OTHER
];

export const VERBAL_REFERRALS = [
  'Local service provider',
  'Mental health service provider',
  'Alcohol and/or drug treatment',
  'LEAD',
  'Shelter',
  OTHER
];

export const COURTESY_TRANSPORTS = [
  'To shelter',
  'Emergency crisis center',
  'Home',
  'Drug/alcohol detox assistance',
  'General'
];

export const NOT_ARRESTED = 'Not arrested';
export const ARRESTED = 'Arrested';
export const CRIMES_AGAINST_PERSON = 'Crimes against person';
export const FELONY = 'Felony';

export const ARRESTABLE_OFFENSES = [
  NOT_ARRESTED,
  ARRESTED,
  CRIMES_AGAINST_PERSON,
  FELONY
];

export const UNABLE_TO_CONTACT = 'Unable to contact';
export const NO_ACTION_NECESSARY = 'No action possible / necessary';
export const RESOURCES_DECLINED = 'Resources offered + declined';

export const NO_ACTION_VALUES = [
  UNABLE_TO_CONTACT,
  NO_ACTION_NECESSARY,
  RESOURCES_DECLINED
];
