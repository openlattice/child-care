
export const STATE = {
  DISPOSITION: 'disposition',
  OFFICER_SAFETY: 'officerSafety',
  SUBJECT_INFORMATION: 'subjectInformation',
  SUBMIT: 'submit'
};

export const HAS_LOCAL_STORAGE_GEO_PERMISSIONS = 'hasLocalStorageGeoPermissions';

export const SUBMIT = {
  SUBMITTING: 'submitting',
  SUCCESS: 'submitSuccess',
  SUBMITTED: 'submitted',
  ERROR: 'error'
};

export const PROVIDERS = {
  RRS_BY_ID: 'rrsById',
  HOSPITALS_BY_ID: 'hospitalsById',
  IS_EXECUTING_SEARCH: 'isExecutingSearch',
  HAS_PERFORMED_INITIAL_SEARCH: 'hasPerformedInitialSearch',

  LAST_SEARCH_TYPE: 'searchType',
  GEO_LOCATION_UNAVAILABLE: 'unableToLoadLocation',
  CURRENT_POSITION: 'currentPosition',

  SELECTED_PROVIDER: 'selectedProvider',

  IS_EDITING_FILTERS: 'isEditingFilters',
  FILTER_PAGE: 'filterPage',
  SEARCH_PAGE: 'searchPage',

  // filters
  ACTIVE_ONLY: 'activeOnly',
  TYPE_OF_CARE: 'typeOfCare',
  ZIP: 'zip',
  RADIUS: 'radius',
  CHILDREN: 'children',
  DAYS: 'days',
  TIMES: 'times'
};
