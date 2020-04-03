// @flow

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const UPDATE_PROFILE_ABOUT :'UPDATE_PROFILE_ABOUT' = 'UPDATE_PROFILE_ABOUT';
const updateProfileAbout :RequestSequence = newRequestSequence(UPDATE_PROFILE_ABOUT);

const CLEAR_PROFILE :'CLEAR_PROFILE' = 'CLEAR_PROFILE';
const clearProfile = () => ({
  type: CLEAR_PROFILE
});

export {
  CLEAR_PROFILE,
  UPDATE_PROFILE_ABOUT,
  clearProfile,
  updateProfileAbout,
};
