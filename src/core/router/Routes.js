/*
 * @flow
 */

// injected by Webpack.DefinePlugin
declare var __BASE_PATH__;

export const ROOT :string = '/';
export const LOGIN_PATH :string = '/login';

export const EDIT_PATH :string = '/edit';
export const HOME_PATH :string = '/home';
export const PROFILE_PATH :string = '/profile';
export const REPORTS_PATH :string = '/reports';
export const LOCATION_PATH :string = '/location';
export const PROVIDER_PATH :string = '/provider';

export const REPORT_ID_PARAM :string = 'reportId';
export const REPORT_ID_PATH :string = `:${REPORT_ID_PARAM}`;
export const REPORT_EDIT_PATH :string = `${REPORTS_PATH}/${REPORT_ID_PATH}${EDIT_PATH}`;
export const REPORT_VIEW_PATH :string = `${REPORTS_PATH}/${REPORT_ID_PATH}/view`;

export const PROFILE_ID_PARAM :string = 'profileId';
export const PROFILE_ID_PATH :string = `:${PROFILE_ID_PARAM}`;
export const PROFILE_VIEW_PATH :string = `${PROFILE_PATH}/${PROFILE_ID_PATH}`;
export const PROFILE_EDIT_PATH :string = `${PROFILE_VIEW_PATH}${EDIT_PATH}`;

export const ABOUT_PATH :string = '/about';
export const BASIC_PATH :string = '/basic-information';
export const CONTACTS_PATH :string = '/contacts';
export const OFFICER_SAFETY_PATH :string = '/officer-safety';
export const RESOURCES_PATH :string = '/resources';
export const FAQS_PATH :string = '/faqs';
export const RESPONSE_PLAN_PATH :string = '/response-plan';
