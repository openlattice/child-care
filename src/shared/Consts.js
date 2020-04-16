import { Models } from 'lattice';

const { FullyQualifiedName } = Models;

export const APP_TYPES_FQNS = {
  APPEARS_IN_FQN: new FullyQualifiedName('app.appearsin'),
  APP_SETTINGS_FQN: new FullyQualifiedName('app.settings'),
  ASSIGNED_TO_FQN: new FullyQualifiedName('app.assignedto'),
  BEHAVIORAL_HEALTH_REPORT_FQN: new FullyQualifiedName('app.bhr'),
  BEHAVIOR_FQN: new FullyQualifiedName('app.behavior'),
  CONTACTED_VIA_FQN: new FullyQualifiedName('app.contactedvia'),
  CONTACT_INFORMATION_FQN: new FullyQualifiedName('app.contactinformation'),
  EMERGENCY_CONTACT_FQN: new FullyQualifiedName('app.emergencycontact'),
  HAS_FQN: new FullyQualifiedName('app.has'),
  HAS_RELATIONSHIP_WITH_FQN: new FullyQualifiedName('app.hasrelationshipwith'),
  HOSPITALS_FQN: new FullyQualifiedName('app.hospitals'),
  IDENTIFYING_CHARACTERISTICS_FQN: new FullyQualifiedName('app.identifyingcharacteristics'),
  IMAGE_FQN: new FullyQualifiedName('app.image'),
  INTERACTION_STRATEGY_FQN: new FullyQualifiedName('app.interactionstrategy'),
  IS_EMERGENCY_CONTACT_FOR_FQN: new FullyQualifiedName('app.isemergencycontactfor'),
  IS_PICTURE_OF_FQN: new FullyQualifiedName('app.ispictureof'),
  LOCATED_AT_FQN: new FullyQualifiedName('app.locatedat'),
  LOCATION_FQN: new FullyQualifiedName('app.location'),
  OBSERVED_IN_FQN: new FullyQualifiedName('app.observedin'),
  OFFICERS_FQN: new FullyQualifiedName('app.officers'),
  OFFICER_SAFETY_CONCERNS_FQN: new FullyQualifiedName('app.officersafetyconcerns'),
  PART_OF_FQN: new FullyQualifiedName('app.partof'),
  PEOPLE_FQN: new FullyQualifiedName('app.people'),
  PERSON_DETAILS_FQN: new FullyQualifiedName('app.persondetails'),
  PHYSICAL_APPEARANCE_FQN: new FullyQualifiedName('app.physicalappearance'),
  REPORTED_FQN: new FullyQualifiedName('app.reported'),
  STAFF_FQN: new FullyQualifiedName('app.staff'),
  STAY_AWAY_LOCATION_FQN: new FullyQualifiedName('app.stayawaylocation'),
  SUBJECT_OF_FQN: new FullyQualifiedName('app.subjectof'),

  INCIDENT_FQN: new FullyQualifiedName('app.incident_new'),
  CALL_FOR_SERVICE_FQN: new FullyQualifiedName('app.callforservice'),
  DIAGNOSIS_FQN: new FullyQualifiedName('app.diagnosis'),
  MEDICATION_STATEMENT_FQN: new FullyQualifiedName('app.medicationstatement'),
  SUBSTANCE_FQN: new FullyQualifiedName('app.substance'),
  SUBSTANCE_HISTORY_FQN: new FullyQualifiedName('app.substancehistory'),
  WEAPON_FQN: new FullyQualifiedName('app.weapon'),
  VIOLENT_BEHAVIOR_FQN: new FullyQualifiedName('app.violentbehavior'),
  INJURY_FQN: new FullyQualifiedName('app.injury'),
  SELF_HARM_FQN: new FullyQualifiedName('app.selfharm'),
  HOUSING_FQN: new FullyQualifiedName('app.housing'),
  OCCUPATION_FQN: new FullyQualifiedName('app.occupation'),
  INCOME_FQN: new FullyQualifiedName('app.income'),
  INSURANCE_FQN: new FullyQualifiedName('app.insurance'),
  INVOLVED_IN_FQN: new FullyQualifiedName('app.involvedin'),
  ENCOUNTER_FQN: new FullyQualifiedName('app.encounters'),
  ENCOUNTER_DETAILS_FQN: new FullyQualifiedName('app.encounterdetails'),
  INVOICE_FQN: new FullyQualifiedName('app.invoice'),
  REFERRAL_REQUEST_FQN: new FullyQualifiedName('app.referralrequest'),

  /* <===== BEGIN LONG BEACH HACK =====> */
  FILED_FOR_FQN: new FullyQualifiedName('app.filed_for'),
  PROBATION_FQN: new FullyQualifiedName('app.probation'),
  SERVED_WITH_FQN: new FullyQualifiedName('app.served_with'),
  SERVICES_OF_PROCESS_FQN: new FullyQualifiedName('app.services_of_process'),
  WARRANTS_FQN: new FullyQualifiedName('app.warrants'),
  /* <===== END LONG BEACH HACK =====> */
  /* <===== BEGIN LIVERMORE HACK =====> */
  LIVES_AT_FQN: new FullyQualifiedName('app.livesat_new'),
  /* <===== END LIVERMORE HACK =====> */
};

export const STRING_ID_FQN = 'general.stringid';

export const RACE = {
  americanIndian: 'American Indian or Alaska Native',
  asian: 'Asian',
  black: 'Black or African American',
  hispanic: 'Hispanic or Latino',
  nativeHawaiian: 'Native Hawaiian or Other Pacific Islander',
  white: 'White',
  other: 'Other'
};

export const FORM_PATHS = {
  CONSUMER_SEARCH: '/bhr/1',
  CONSUMER: '/bhr/2',
  REPORT: '/bhr/3',
  COMPLAINANT: '/bhr/4',
  DISPOSITION: '/bhr/5',
  OFFICER: '/bhr/6',
  REVIEW: '/bhr/7'
};

export const FORM_ERRORS = {
  INVALID_FORMAT: 'Some formats are invalid',
  IS_REQUIRED: 'Some required fields are empty'
};

export const STATES = [
  'AL',
  'AK',
  'AZ',
  'AR',
  'CA',
  'CO',
  'CT',
  'DE',
  'FL',
  'GA',
  'HI',
  'ID',
  'IL',
  'IN',
  'IA',
  'KS',
  'KY',
  'LA',
  'ME',
  'MD',
  'MA',
  'MI',
  'MN',
  'MS',
  'MO',
  'MT',
  'NE',
  'NV',
  'NH',
  'NJ',
  'NM',
  'NY',
  'NC',
  'ND',
  'OH',
  'OK',
  'OR',
  'PA',
  'RI',
  'SC',
  'SD',
  'TN',
  'TX',
  'UT',
  'VT',
  'VA',
  'WA',
  'WV',
  'WI',
  'WY'
];

export const DATA_URL_PREFIX = 'data:image/png;base64,';
