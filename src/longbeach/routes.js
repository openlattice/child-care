// @flow

export const HOME_PATH :string = '/home';
export const PEOPLE_PATH :string = '/people';
export const LOCATION_PATH :string = '/location';
export const PROVIDER_PATH :string = '/provider';
export const PROFILE_PATH :string = '/profile';

export const PROFILE_ID_PARAM :string = 'profileId';
export const PROFILE_ID_PATH :string = `:${PROFILE_ID_PARAM}`;
export const PROFILE_VIEW_PATH :string = `${PROFILE_PATH}/${PROFILE_ID_PATH}`;
