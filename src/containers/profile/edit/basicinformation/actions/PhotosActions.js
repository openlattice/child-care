// @flow
import { newRequestSequence } from 'redux-reqseq';

const GET_PHOTOS :'GET_PHOTOS' = 'GET_PHOTOS';
const getPhotos = newRequestSequence(GET_PHOTOS);

const SUBMIT_PHOTOS :'SUBMIT_PHOTOS' = 'SUBMIT_PHOTOS';
const submitPhotos = newRequestSequence(SUBMIT_PHOTOS);

const UPDATE_PHOTO :'UPDATE_PHOTO' = 'UPDATE_PHOTO';
const updatePhoto = newRequestSequence(UPDATE_PHOTO);

export {
  GET_PHOTOS,
  SUBMIT_PHOTOS,
  UPDATE_PHOTO,
  getPhotos,
  submitPhotos,
  updatePhoto,
};
