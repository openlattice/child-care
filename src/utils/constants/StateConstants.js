
export const STATE = {
  DISPOSITION: 'disposition',
  NATURE_OF_CRISIS: 'natureOfCrisis',
  OBSERVED_BEHAVIORS: 'observedBehaviors',
  OFFICER_SAFETY: 'officerSafety',
  SUBJECT_INFORMATION: 'subjectInformation',
  SUBMIT: 'submit'
};

export const SUBMIT = {
  SUBMITTING: 'submitting',
  SUCCESS: 'submitSuccess',
  SUBMITTED: 'submitted',
  ERROR: 'error'
};

export const PROVIDERS = {
  HOSPITALS: 'hospitals',
  RRS_BY_ID: 'rrsById',
  HOSPITALS_BY_ID: 'hospitalsById',
  IS_EXECUTING_SEARCH: 'isExecutingSearch',
  HAS_PERFORMED_INITIAL_SEARCH: 'hasPerformedInitialSearch',

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
