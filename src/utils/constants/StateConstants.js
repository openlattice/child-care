export const STATE = {
  LOCATIONS: 'locations'
};

export const HAS_LOCAL_STORAGE_GEO_PERMISSIONS = 'hasLocalStorageGeoPermissions';

export const LANGUAGES = {
  ENGLISH: 'en',
  SPANISH: 'es'
};

export const APPLICAITON = {
  ENTITY_SET_ID: 'entitySetId',
  PROPERTY_TYPES_BY_ID: 'propertyTypesById',
  PROPERTY_TYPES_BY_FQN: 'propertyTypesByFqn',
  TOKEN: 'token',
  TOKEN_EXP: 'tokenExp',
  GET_TEXT: 'getText',
  SESSION_ID: 'sessionId'
};

export const PROVIDERS = {
  RRS_BY_ID: 'rrsById',
  HOSPITALS_BY_ID: 'hospitalsById',
  HAS_PERFORMED_INITIAL_SEARCH: 'hasPerformedInitialSearch',

  LAST_SEARCH_TYPE: 'searchType',
  GEO_LOCATION_UNAVAILABLE: 'unableToLoadLocation',
  CURRENT_POSITION: 'currentPosition',

  SEARCH_INPUTS: 'searchInputs',
  SELECTED_OPTION: 'selectedOption',
  SELECTED_PROVIDER: 'selectedProvider',
  SELECTED_REFERRAL_AGENCY: 'selectedReferralAgency',
  LAT: 'lat',
  LON: 'lon',

  IS_EDITING_FILTERS: 'isEditingFilters',
  FILTER_PAGE: 'filterPage',
  PAGE: 'searchPage',
  PROVIDER_LOCATIONS: 'providerLocations',

  // filters
  ACTIVE_ONLY: 'activeOnly',
  TYPE_OF_CARE: 'typeOfCare',
  ZIP: 'zip',
  RADIUS: 'radius',
  CHILDREN: 'children',
  DAYS: 'days',
  TIMES: 'times'
};
