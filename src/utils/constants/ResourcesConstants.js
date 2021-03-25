import { en, es } from './labels/Languages';
const CRRN_PHONE = '(415) 882-0234';
const CRRN_URL = {
  [en]: 'https://rrnetwork.org/ ',
  [es]: 'https://rrnetwork.org/ '
};
const CALIFONRIA_COVID_CHILDCARE_RESPONSE_URL = {
  [en]: 'https://covid19.ca.gov/childcare/',
  [es]: 'https://covid19.ca.gov/es/childcare/'
};
const CALIFONRIA_PARENT_AND_FAMILY_RESOURCES_URL = {
  [en]: 'https://www.cdss.ca.gov/inforesources/child-care-licensing/resources-for-parents',
  [es]: 'https://www.cdss.ca.gov/inforesources/child-care-licensing/resources-for-parents'
};
const FAMILY_CHILDCARE_HOME_LICENSING_INFO_URL = {
  [en]: 'https://www.cdss.ca.gov/inforesources/child-care-licensing/how-to-become-licensed/fcch-licensing-information',
  [es]: 'https://www.cdss.ca.gov/inforesources/child-care-licensing/how-to-become-licensed/fcch-licensing-information'
};

export const RESOURCES_CONTENT = {
  CALIFORNIA_RESOURCE_AND_REFERRAL_NETWORK: { PHONE: CRRN_PHONE, URL: CRRN_URL },
  CALIFORNIA_COVID19_CHILDCARE_RESPONSE: { URL: CALIFONRIA_COVID_CHILDCARE_RESPONSE_URL },
  CALIFORNIA_PARENT_AND_FAMILY_RESOURCES: { URL: CALIFONRIA_PARENT_AND_FAMILY_RESOURCES_URL },
  FAMILY_CHILD_CARE_HOME_LICENSING_INFORMATION: { URL: FAMILY_CHILDCARE_HOME_LICENSING_INFO_URL },
};
