import { Constants, Models } from 'lattice';

const { FullyQualifiedName } = Models;
const { OPENLATTICE_ID_FQN } = Constants;

export { OPENLATTICE_ID_FQN };
/* substance */
const TEMPORAL_STATUS_FQN = new FullyQualifiedName('ol.temporalstatus');
export { TEMPORAL_STATUS_FQN };

/* referral request */
const SERVICE_TYPE_FQN = new FullyQualifiedName('ol.servicetype');
export { SERVICE_TYPE_FQN };

/* encounter */
const SERVICE_SETTING_FQN = new FullyQualifiedName('ol.servicesetting');
export { SERVICE_SETTING_FQN };

/* encounter details */
const LAW_ENFORCEMENT_INVOLVEMENT_FQN = new FullyQualifiedName('ol.lawenforcementinvolvement');
const REASON_FQN = new FullyQualifiedName('ol.reason');
const LEVEL_OF_CARE_FQN = new FullyQualifiedName('ol.levelofcare');

export {
  LAW_ENFORCEMENT_INVOLVEMENT_FQN,
  LEVEL_OF_CARE_FQN,
  REASON_FQN,
};

/* invoice */
const LINE_ITEM_FQN = new FullyQualifiedName('ol.lineitem');
export { LINE_ITEM_FQN };

const NUM_SOURCES_FOUND_IN_FQN = new FullyQualifiedName('ol.numsourcesfoundin');
const NUMBER_OF_PEOPLE_FQN = new FullyQualifiedName('ol.numberofpeople');
export {
  NUM_SOURCES_FOUND_IN_FQN,
  NUMBER_OF_PEOPLE_FQN
};

/* disposition */
const CJ_DISPOSITION_FQN = new FullyQualifiedName('criminaljustice.disposition');
export { CJ_DISPOSITION_FQN };

/* self harm */
const ACTION_FQN = new FullyQualifiedName('ol.action');
export {
  ACTION_FQN
};

/* medication */
const TAKEN_AS_PRESCRIBED_FQN = new FullyQualifiedName('ol.takenasprescribed');
export {
  TAKEN_AS_PRESCRIBED_FQN
};

/* call for service */
const HOW_REPORTED_FQN = new FullyQualifiedName('ol.howreported');
export {
  HOW_REPORTED_FQN
};

/* incident */
const DATETIME_START_FQN = new FullyQualifiedName('ol.datetimestart');
const DATETIME_END_FQN = new FullyQualifiedName('ol.datetimeend');
const CRIMINALJUSTICE_CASE_NUMBER_FQN = new FullyQualifiedName('criminaljustice.casenumber');
export {
  CRIMINALJUSTICE_CASE_NUMBER_FQN,
  DATETIME_END_FQN,
  DATETIME_START_FQN,
};

/* Person Details */
const SPECIAL_NEEDS_FQN = new FullyQualifiedName('ol.specialneeds');
const VETERAN_STATUS_FQN = new FullyQualifiedName('person.veteranstatus');

export {
  SPECIAL_NEEDS_FQN,
  VETERAN_STATUS_FQN,
};

/* <===== BEGIN LONG BEACH HACK =====> */
const NAME_FQN = new FullyQualifiedName('ol.name');
const NUMBER_OF_SPACES_AVAILABLE_FQN = new FullyQualifiedName('ol.numberofspacesavailable');
const NUMBER_OF_SPACES_TOTAL_FQN = new FullyQualifiedName('ol.numberofspacestotal');
const HOURS_OF_OPERATION_FQN = new FullyQualifiedName('ol.hoursofoperation');

const WARRANT_NUMBER_FQN = new FullyQualifiedName('ol.warrantnumber');
const RECOGNIZED_START_DATE_FQN = new FullyQualifiedName('ol.recognizedstartdate');
const RECOGNIZED_END_DATE_FQN = new FullyQualifiedName('ol.recognizedenddate');
export {
  NAME_FQN,
  RECOGNIZED_START_DATE_FQN,
  RECOGNIZED_END_DATE_FQN,
  WARRANT_NUMBER_FQN,
  NUMBER_OF_SPACES_AVAILABLE_FQN,
  NUMBER_OF_SPACES_TOTAL_FQN,
  HOURS_OF_OPERATION_FQN,
};
/* <===== END LONG BEACH HACK =====> */

/* Issue */
const PRIORITY_FQN = new FullyQualifiedName('ol.priority');
const STATUS_FQN = new FullyQualifiedName('ol.status');
const ENTRY_UPDATED_FQN = new FullyQualifiedName('general.entryupdated');

export {
  ENTRY_UPDATED_FQN,
  PRIORITY_FQN,
  STATUS_FQN
};

/* Is Emergency Contact For */
const RELATIONSHIP_FQN = new FullyQualifiedName('ol.relationship');

export { RELATIONSHIP_FQN };

/* Contact Information */
const CONTACT_PHONE_NUMBER_FQN = new FullyQualifiedName('contact.phonenumber');
const EXTENTION_FQN = new FullyQualifiedName('ol.extension');
const GENERAL_NOTES_FQN = new FullyQualifiedName('general.notes');
const PREFERRED_FQN = new FullyQualifiedName('ol.preferred');

export {
  CONTACT_PHONE_NUMBER_FQN,
  EXTENTION_FQN,
  GENERAL_NOTES_FQN,
  PREFERRED_FQN,
};

/* Image Data */
const IMAGE_DATA_FQN = new FullyQualifiedName('ol.imagedata');

export { IMAGE_DATA_FQN };

/*
 * Behavior
 */

const TRIGGER_FQN = new FullyQualifiedName('ol.trigger');
const OBSERVED_BEHAVIOR_FQN = new FullyQualifiedName('ol.observedbehavior');

export {
  OBSERVED_BEHAVIOR_FQN,
  TRIGGER_FQN,
};

/*
 * Location
 */

const LOCATION_ADDRESS_FQN = new FullyQualifiedName('location.address');
const LOCATION_ADDRESS_LINE_2_FQN = new FullyQualifiedName('location.addressline2');
const LOCATION_CITY_FQN = new FullyQualifiedName('location.city');
const LOCATION_COORDINATES_FQN = new FullyQualifiedName('ol.locationcoordinates');
const LOCATION_NAME_FQN = new FullyQualifiedName('location.name');
const LOCATION_STATE_FQN = new FullyQualifiedName('location.state');
const LOCATION_STREET_FQN = new FullyQualifiedName('location.street');
const LOCATION_ZIP_FQN = new FullyQualifiedName('location.zip');

export {
  LOCATION_ADDRESS_FQN,
  LOCATION_ADDRESS_LINE_2_FQN,
  LOCATION_CITY_FQN,
  LOCATION_COORDINATES_FQN,
  LOCATION_NAME_FQN,
  LOCATION_STATE_FQN,
  LOCATION_STREET_FQN,
  LOCATION_ZIP_FQN,
};

/*
 * Response Plan
 */

const CONTEXT_FQN = new FullyQualifiedName('ol.context');
const NOTES_FQN = new FullyQualifiedName('ol.notes');
export {
  CONTEXT_FQN,
  NOTES_FQN
};

/*
 * Interaction Strategy
 */

const DESCRIPTION_FQN = new FullyQualifiedName('ol.description');
const INDEX_FQN = new FullyQualifiedName('ol.index');
const TECHNIQUES_FQN = new FullyQualifiedName('ol.techniques');
const TITLE_FQN = new FullyQualifiedName('ol.title');
export {
  DESCRIPTION_FQN,
  INDEX_FQN,
  TECHNIQUES_FQN,
  TITLE_FQN,
};

/*
 * AppSettings
 */

const APP_DETAILS_FQN = new FullyQualifiedName('ol.appdetails');
export {
  APP_DETAILS_FQN
};

/*
 * PhysicalAppearance
 */

const COMPLEXION_FQN = new FullyQualifiedName('nc.complexion');
const HAIR_COLOR_FQN = new FullyQualifiedName('ol.haircolor');
const FACIAL_HAIR_FQN = new FullyQualifiedName('ol.facialhair');
const HEIGHT_FQN = new FullyQualifiedName('ol.height');
const WEIGHT_FQN = new FullyQualifiedName('ol.weight');
const BODY_DESCRIPTION_FQN = new FullyQualifiedName('ol.bodydescription');
const EYE_COLOR_FQN = new FullyQualifiedName('ol.eyecolor');
const GROOMING_FQN = new FullyQualifiedName('ol.grooming');

export {
  COMPLEXION_FQN,
  HAIR_COLOR_FQN,
  FACIAL_HAIR_FQN,
  HEIGHT_FQN,
  WEIGHT_FQN,
  BODY_DESCRIPTION_FQN,
  EYE_COLOR_FQN,
  GROOMING_FQN
};

/*
 * ReportInfoView
 */

const CAD_NUMBER_FQN = new FullyQualifiedName('bhr.cadNumber');
const COMPANION_OFFENSE_REPORT_FQN = new FullyQualifiedName('bhr.companionOffenseReport');
const COMPLAINT_NUMBER_FQN = new FullyQualifiedName('bhr.complaintNumber');
const DATE_TIME_OCCURRED_FQN = new FullyQualifiedName('bhr.datetimeOccurred');
const DATE_TIME_REPORTED_FQN = new FullyQualifiedName('bhr.datetimeReported');
const DISPATCH_REASON_FQN = new FullyQualifiedName('bhr.dispatchReason');
const DISPATCH_REASON_OTHER_FQN = new FullyQualifiedName('ol.reasonother');
const INCIDENT_FQN = new FullyQualifiedName('bhr.incident');
const INCIDENT_OTHER_FQN = new FullyQualifiedName('ol.incidenttypeother');
const LOCATION_OF_INCIDENT_FQN = new FullyQualifiedName('bhr.locationOfIncident');
const ON_VIEW_FQN = new FullyQualifiedName('bhr.onView');
const POST_OF_OCCURRENCE_FQN = new FullyQualifiedName('bhr.postOfOccurrence');
const UNIT_FQN = new FullyQualifiedName('bhr.unit');

export {
  CAD_NUMBER_FQN,
  COMPANION_OFFENSE_REPORT_FQN,
  COMPLAINT_NUMBER_FQN,
  DATE_TIME_OCCURRED_FQN,
  DATE_TIME_REPORTED_FQN,
  DISPATCH_REASON_FQN,
  DISPATCH_REASON_OTHER_FQN,
  INCIDENT_FQN,
  INCIDENT_OTHER_FQN,
  LOCATION_OF_INCIDENT_FQN,
  ON_VIEW_FQN,
  POST_OF_OCCURRENCE_FQN,
  UNIT_FQN
};

/*
 * ConsumerInfoView
 */

const ADDRESS_FQN = new FullyQualifiedName('bhr.address');
const PHONE_FQN = new FullyQualifiedName('bhr.phone');
const MILITARY_STATUS_FQN = new FullyQualifiedName('bhr.militaryStatus');
const GENDER_FQN = new FullyQualifiedName('bhr.gender');
const RACE_FQN = new FullyQualifiedName('bhr.race');
const AGE_FQN = new FullyQualifiedName('bhr.age');
const DOB_FQN = new FullyQualifiedName('bhr.dob');
const HOMELESS_FQN = new FullyQualifiedName('bhr.homeless');
const HOMELESS_LOCATION_FQN = new FullyQualifiedName('bhr.homelessLocation');
const DRUGS_ALCOHOL_FQN = new FullyQualifiedName('bhr.drugsAlcohol');
const DRUG_TYPE_FQN = new FullyQualifiedName('bhr.drugType');
const DRUG_TYPE_OTHER_FQN = new FullyQualifiedName('ol.drugtypeother');
const PRESCRIBED_MEDICATION_FQN = new FullyQualifiedName('bhr.prescribedMedication');
const TAKING_MEDICATION_FQN = new FullyQualifiedName('bhr.takingMedication');
const PREV_PSYCH_ADMISSION_FQN = new FullyQualifiedName('bhr.prevPsychAdmission');
const SELF_DIAGNOSIS_FQN = new FullyQualifiedName('bhr.selfDiagnosis');
const SELF_DIAGNOSIS_OTHER_FQN = new FullyQualifiedName('bhr.selfDiagnosisOther');
const ARMED_WITH_WEAPON_FQN = new FullyQualifiedName('bhr.armedWithWeapon');
const ARMED_WEAPON_TYPE_FQN = new FullyQualifiedName('bhr.armedWeaponType');
const ACCESS_TO_WEAPONS_FQN = new FullyQualifiedName('bhr.accessToWeapons');
const ACCESSIBLE_WEAPON_TYPE_FQN = new FullyQualifiedName('bhr.accessibleWeaponType');
const OBSERVED_BEHAVIORS_FQN = new FullyQualifiedName('bhr.observedBehaviors');
const OBSERVED_BEHAVIORS_OTHER_FQN = new FullyQualifiedName('bhr.observedBehaviorsOther');
const EMOTIONAL_STATE_FQN = new FullyQualifiedName('bhr.emotionalState');
const EMOTIONAL_STATE_OTHER_FQN = new FullyQualifiedName('bhr.emotionalStateOther');
const PHOTOS_TAKEN_OF_FQN = new FullyQualifiedName('bhr.photosTakenOf');
const INJURIES_FQN = new FullyQualifiedName('bhr.injuries');
const INJURIES_OTHER_FQN = new FullyQualifiedName('bhr.injuriesOther');
const SUICIDAL_FQN = new FullyQualifiedName('bhr.suicidal');
const SUICIDAL_ACTIONS_FQN = new FullyQualifiedName('bhr.suicidalActions');
const SUICIDE_ATTEMPT_METHOD_FQN = new FullyQualifiedName('bhr.suicideAttemptMethod');
const SUICIDE_ATTEMPT_METHOD_OTHER_FQN = new FullyQualifiedName('bhr.suicideAttemptMethodOther');
const DIRECTED_AGAINST_FQN = new FullyQualifiedName('ol.directedagainst');
const DIRECTED_AGAINST_OTHER_FQN = new FullyQualifiedName('ol.directedagainstother');
const DIRECTED_AGAINST_RELATION_FQN = new FullyQualifiedName('ol.directedrelation');
const HIST_DIRECTED_AGAINST_FQN = new FullyQualifiedName('ol.historicaldirectedagainst');
const HIST_DIRECTED_AGAINST_OTHER_FQN = new FullyQualifiedName('ol.historicaldirectedagainstother');
const HISTORY_OF_VIOLENCE_FQN = new FullyQualifiedName('ol.historyofviolence');
const HISTORY_OF_VIOLENCE_TEXT_FQN = new FullyQualifiedName('ol.historyofviolencetext');
const SCALE_1_TO_10_FQN = new FullyQualifiedName('ol.scale1to10');

export {
  ADDRESS_FQN,
  PHONE_FQN,
  MILITARY_STATUS_FQN,
  GENDER_FQN,
  RACE_FQN,
  AGE_FQN,
  DOB_FQN,
  HOMELESS_FQN,
  HOMELESS_LOCATION_FQN,
  DRUGS_ALCOHOL_FQN,
  DRUG_TYPE_FQN,
  DRUG_TYPE_OTHER_FQN,
  PRESCRIBED_MEDICATION_FQN,
  TAKING_MEDICATION_FQN,
  PREV_PSYCH_ADMISSION_FQN,
  SELF_DIAGNOSIS_FQN,
  SELF_DIAGNOSIS_OTHER_FQN,
  ARMED_WITH_WEAPON_FQN,
  ARMED_WEAPON_TYPE_FQN,
  ACCESS_TO_WEAPONS_FQN,
  ACCESSIBLE_WEAPON_TYPE_FQN,
  OBSERVED_BEHAVIORS_FQN,
  OBSERVED_BEHAVIORS_OTHER_FQN,
  EMOTIONAL_STATE_FQN,
  EMOTIONAL_STATE_OTHER_FQN,
  PHOTOS_TAKEN_OF_FQN,
  INJURIES_FQN,
  INJURIES_OTHER_FQN,
  SUICIDAL_FQN,
  SUICIDAL_ACTIONS_FQN,
  SUICIDE_ATTEMPT_METHOD_FQN,
  SUICIDE_ATTEMPT_METHOD_OTHER_FQN,
  DIRECTED_AGAINST_FQN,
  DIRECTED_AGAINST_OTHER_FQN,
  DIRECTED_AGAINST_RELATION_FQN,
  HIST_DIRECTED_AGAINST_FQN,
  HIST_DIRECTED_AGAINST_OTHER_FQN,
  HISTORY_OF_VIOLENCE_FQN,
  HISTORY_OF_VIOLENCE_TEXT_FQN,
  SCALE_1_TO_10_FQN
};

const PERSON_DOB_FQN = new FullyQualifiedName('nc.PersonBirthDate');
const PERSON_ETHNICITY_FQN = new FullyQualifiedName('nc.PersonEthnicity');
const PERSON_EYE_COLOR_FQN = new FullyQualifiedName('nc.PersonEyeColorText');
const PERSON_FIRST_NAME_FQN = new FullyQualifiedName('nc.PersonGivenName');
const PERSON_HAIR_COLOR_FQN = new FullyQualifiedName('nc.PersonHairColorText');
const PERSON_HEIGHT_FQN = new FullyQualifiedName('nc.PersonHeightMeasure');
const PERSON_ID_FQN = new FullyQualifiedName('nc.SubjectIdentification');
const PERSON_LAST_NAME_FQN = new FullyQualifiedName('nc.PersonSurName');
const PERSON_MIDDLE_NAME_FQN = new FullyQualifiedName('nc.PersonMiddleName');
const PERSON_NICK_NAME_FQN = new FullyQualifiedName('im.PersonNickName');
const PERSON_PICTURE_FQN = new FullyQualifiedName('person.picture');
const PERSON_RACE_FQN = new FullyQualifiedName('nc.PersonRace');
const PERSON_SEX_FQN = new FullyQualifiedName('nc.PersonSex');
const PERSON_SSN_LAST_4_FQN = new FullyQualifiedName('general.ssnlast4');
const PERSON_SUFFIX_FQN = new FullyQualifiedName('nc.PersonSuffix');
const PERSON_WEIGHT_FQN = new FullyQualifiedName('nc.PersonWeightMeasure');


export {
  PERSON_DOB_FQN,
  PERSON_ETHNICITY_FQN,
  PERSON_EYE_COLOR_FQN,
  PERSON_FIRST_NAME_FQN,
  PERSON_HAIR_COLOR_FQN,
  PERSON_HEIGHT_FQN,
  PERSON_ID_FQN,
  PERSON_LAST_NAME_FQN,
  PERSON_MIDDLE_NAME_FQN,
  PERSON_NICK_NAME_FQN,
  PERSON_PICTURE_FQN,
  PERSON_RACE_FQN,
  PERSON_SEX_FQN,
  PERSON_SSN_LAST_4_FQN,
  PERSON_SUFFIX_FQN,
  PERSON_WEIGHT_FQN,
};

/*
 * ComplainantInfoView
 */

const COMPLAINANT_NAME_FQN = new FullyQualifiedName('bhr.complainantName');
const COMPLAINANT_ADDRESS_FQN = new FullyQualifiedName('bhr.complainantAddress');
const COMPLAINANT_RELATIONSHIP_FQN = new FullyQualifiedName('bhr.complainantConsumerRelationship');
const COMPLAINANT_PHONE_FQN = new FullyQualifiedName('bhr.complainantPhone');

export {
  COMPLAINANT_NAME_FQN,
  COMPLAINANT_ADDRESS_FQN,
  COMPLAINANT_RELATIONSHIP_FQN,
  COMPLAINANT_PHONE_FQN
};

/*
 * DispositionInfoView
 */

const DEESCALATION_SCALE_FQN = new FullyQualifiedName('ol.deescalationscale');
const DEESCALATION_TECHNIQUES_FQN = new FullyQualifiedName('bhr.deescalationTechniques');
const DEESCALATION_TECHNIQUES_OTHER_FQN = new FullyQualifiedName('bhr.deescalationTechniquesOther');
const DISPOSITION_FQN = new FullyQualifiedName('bhr.disposition');
const HOSPITAL_TRANSPORT_INDICATOR_FQN = new FullyQualifiedName('bhr.hospitalTransport');
const HOSPITAL_FQN = new FullyQualifiedName('bhr.hospital');
const HOSPITAL_NAME_FQN = new FullyQualifiedName('health.hospitalname');
const INCIDENT_NARRATIVE_FQN = new FullyQualifiedName('bhr.incidentNarrative');
const REFERRAL_DEST_FQN = new FullyQualifiedName('housing.referraldestination');
const REFERRAL_PROVIDER_INDICATOR_FQN = new FullyQualifiedName('ol.referralprovidedindicator');
const SPECIAL_RESOURCES_CALLED_FQN = new FullyQualifiedName('bhr.specializedResourcesCalled');
const STABILIZED_INDICATOR_FQN = new FullyQualifiedName('ol.stabilizedindicator');
const TRANSPORTING_AGENCY_FQN = new FullyQualifiedName('place.TransportingAgency');
const VOLUNTARY_ACTION_INDICATOR_FQN = new FullyQualifiedName('ol.voluntaryactionindicator');

export {
  DEESCALATION_SCALE_FQN,
  DEESCALATION_TECHNIQUES_FQN,
  DEESCALATION_TECHNIQUES_OTHER_FQN,
  DISPOSITION_FQN,
  HOSPITAL_TRANSPORT_INDICATOR_FQN,
  HOSPITAL_FQN,
  HOSPITAL_NAME_FQN,
  INCIDENT_NARRATIVE_FQN,
  REFERRAL_DEST_FQN,
  REFERRAL_PROVIDER_INDICATOR_FQN,
  SPECIAL_RESOURCES_CALLED_FQN,
  STABILIZED_INDICATOR_FQN,
  TRANSPORTING_AGENCY_FQN,
  VOLUNTARY_ACTION_INDICATOR_FQN
};

/*
 * OfficerInfoView
 */

const OFFICER_NAME_FQN = new FullyQualifiedName('bhr.officerName');
const OFFICER_SEQ_ID_FQN = new FullyQualifiedName('bhr.officerSeqID');
const OFFICER_INJURIES_FQN = new FullyQualifiedName('bhr.officerInjuries');
const OFFICER_CERTIFICATION_FQN = new FullyQualifiedName('bhr.officerCertification');

export {
  OFFICER_NAME_FQN,
  OFFICER_SEQ_ID_FQN,
  OFFICER_INJURIES_FQN,
  OFFICER_CERTIFICATION_FQN
};

/*
 * Other
 */

const COMPLETED_DT_FQN = new FullyQualifiedName('date.completeddatetime');
const DATE_TIME_FQN = new FullyQualifiedName('general.datetime');
const GENERAL_STATUS_FQN = new FullyQualifiedName('general.status');

export {
  COMPLETED_DT_FQN,
  DATE_TIME_FQN,
  GENERAL_STATUS_FQN
};

/*
 * Crisis Report Specific
 */

const BIOLOGICALLY_INDUCED_CAUSES_FQN = new FullyQualifiedName('bhr.biologicallyinducedoptions');
const CHEMICALLY_INDUCED_CAUSES_FQN = new FullyQualifiedName('bhr.chemicallyinducedoptions');
const DEMEANORS_FQN = new FullyQualifiedName('ol.attitude');
const OTHER_DEMEANORS_FQN = new FullyQualifiedName('ol.attitudeother');
const PERSON_ASSISTING_FQN = new FullyQualifiedName('ol.persontoassist');
const OTHER_PERSON_ASSISTING_FQN = new FullyQualifiedName('ol.persontoassistother');
const NARCAN_ADMINISTERED_FQN = new FullyQualifiedName('ol.narcanadministered');
const HOUSING_SITUATION_FQN = new FullyQualifiedName('housing.living_arrangements');
const ARREST_INDICATOR_FQN = new FullyQualifiedName('ol.arrestedindicator');
const CRIMES_AGAINST_PERSON_FQN = new FullyQualifiedName('ol.crimeagainstperson');
const FELONY_INDICATOR_FQN = new FullyQualifiedName('ol.felony');
const ARRESTABLE_OFFENSE_FQN = new FullyQualifiedName('ol.arrestableoffense');
const OL_ID_FQN = new FullyQualifiedName('ol.id');
const STRING_ID_FQN = new FullyQualifiedName('general.stringid');
const TYPE_FQN = new FullyQualifiedName('ol.type');
const CATEGORY_FQN = new FullyQualifiedName('ol.category');
const OTHER_TEXT_FQN = new FullyQualifiedName('ol.othertext');
const ORGANIZATION_NAME_FQN = new FullyQualifiedName('ol.organizationname');
const NO_ACTION_POSSIBLE_FQN = new FullyQualifiedName('ol.noactionpossible');
const UNABLE_TO_CONTACT_FQN = new FullyQualifiedName('ol.unabletocontact');
const RESOURCES_DECLINED_FQN = new FullyQualifiedName('ol.offereddeclined');
const OTHER_NOTIFIED_FQN = new FullyQualifiedName('ol.othernotified');
const OTHER_WEAPON_TYPE_FQN = new FullyQualifiedName('ol.weapontypeother');
const THREATENED_INDICATOR_FQN = new FullyQualifiedName('ol.threatened');
const PERSON_INJURED_FQN = new FullyQualifiedName('ol.personinjured');
const OTHER_PERSON_INJURED_FQN = new FullyQualifiedName('ol.otherpersoninjured');
const TRANSPORT_INDICATOR_FQN = new FullyQualifiedName('ol.transportindicator');
const SUPERVISOR_FQN = new FullyQualifiedName('bhr.supervisor');
const SUPERVISOR_ID_FQN = new FullyQualifiedName('bhr.supervisorID');

export {
  BIOLOGICALLY_INDUCED_CAUSES_FQN,
  CHEMICALLY_INDUCED_CAUSES_FQN,
  DEMEANORS_FQN,
  OTHER_DEMEANORS_FQN,
  PERSON_ASSISTING_FQN,
  OTHER_PERSON_ASSISTING_FQN,
  NARCAN_ADMINISTERED_FQN,
  HOUSING_SITUATION_FQN,
  ARREST_INDICATOR_FQN,
  CRIMES_AGAINST_PERSON_FQN,
  NO_ACTION_POSSIBLE_FQN,
  FELONY_INDICATOR_FQN,
  ARRESTABLE_OFFENSE_FQN,
  OL_ID_FQN,
  STRING_ID_FQN,
  TYPE_FQN,
  CATEGORY_FQN,
  OTHER_TEXT_FQN,
  ORGANIZATION_NAME_FQN,
  UNABLE_TO_CONTACT_FQN,
  RESOURCES_DECLINED_FQN,
  OTHER_NOTIFIED_FQN,
  OTHER_WEAPON_TYPE_FQN,
  THREATENED_INDICATOR_FQN,
  PERSON_INJURED_FQN,
  OTHER_PERSON_INJURED_FQN,
  TRANSPORT_INDICATOR_FQN,
  SUPERVISOR_FQN,
  SUPERVISOR_ID_FQN
};
