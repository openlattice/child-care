// @flow
import { newRequestSequence } from 'redux-reqseq';

const SUBMIT_CONTACTS :'SUBMIT_CONTACTS' = 'SUBMIT_CONTACTS';
const submitContacts = newRequestSequence(SUBMIT_CONTACTS);

const GET_CONTACTS :'GET_CONTACTS' = 'GET_CONTACTS';
const getContacts = newRequestSequence(GET_CONTACTS);

const UPDATE_CONTACT :'UPDATE_CONTACT' = 'UPDATE_CONTACT';
const updateContact = newRequestSequence(UPDATE_CONTACT);

const DELETE_CONTACT :'DELETE_CONTACT' = 'DELETE_CONTACT';
const deleteContact = newRequestSequence(DELETE_CONTACT);

export {
  DELETE_CONTACT,
  GET_CONTACTS,
  SUBMIT_CONTACTS,
  UPDATE_CONTACT,
  deleteContact,
  getContacts,
  submitContacts,
  updateContact,
};
