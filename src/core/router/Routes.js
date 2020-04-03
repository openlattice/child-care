/*
 * @flow
 */

// injected by Webpack.DefinePlugin
declare var __BASE_PATH__;

export const ROOT :string = '/';
export const LOGIN_PATH :string = '/login';

export const X_CRISIS_PATH :string = '/x-crisis';
export const NEW_CRISIS_PATH :string = '/new-crisis';
export const CRISIS_PATH :string = '/crisis';
export const DASHBOARD_PATH :string = '/dashboard';
export const DOWNLOADS_PATH :string = '/downloads';
export const EDIT_PATH :string = '/edit';
export const ENCAMPMENTS_PATH :string = '/encampments';
export const ENCAMPMENT_ID_PARAM :string = 'encampmentId';
export const ENCAMPMENT_ID_PATH :string = `:${ENCAMPMENT_ID_PARAM}`;
export const ENCAMPMENT_VIEW_PATH :string = `${ENCAMPMENTS_PATH}/${ENCAMPMENT_ID_PATH}`;
export const HOME_PATH :string = '/home';
export const LOGOUT_PATH :string = '/logout';
export const PROFILE_PATH :string = '/profile';
export const REPORTS_PATH :string = '/reports';
export const LOCATION_PATH :string = '/location';
export const PROVIDER_PATH :string = '/provider';
export const ISSUES_PATH :string = '/issues';
export const ISSUE_ID_PARAM :string = 'issueId';
export const ISSUE_PATH :string = `${ISSUES_PATH}/:${ISSUE_ID_PARAM}`;

export const REPORT_ID_PARAM :string = 'reportId';
export const REPORT_ID_PATH :string = `:${REPORT_ID_PARAM}`;
export const REPORT_EDIT_PATH :string = `${REPORTS_PATH}/${REPORT_ID_PATH}${EDIT_PATH}`;
export const REPORT_VIEW_PATH :string = `${REPORTS_PATH}/${REPORT_ID_PATH}/view`;
export const CRISIS_REPORT_PATH :string = `${REPORTS_PATH}/crisis/${REPORT_ID_PATH}`;

export const PROFILE_ID_PARAM :string = 'profileId';
export const PROFILE_ID_PATH :string = `:${PROFILE_ID_PARAM}`;
export const PROFILE_VIEW_PATH :string = `${PROFILE_PATH}/${PROFILE_ID_PATH}`;
export const PROFILE_EDIT_PATH :string = `${PROFILE_VIEW_PATH}${EDIT_PATH}`;

export const ABOUT_PATH :string = '/about';
export const BASIC_PATH :string = '/basic-information';
export const CONTACTS_PATH :string = '/contacts';
export const OFFICER_SAFETY_PATH :string = '/officer-safety';
export const RESPONSE_PLAN_PATH :string = '/response-plan';
