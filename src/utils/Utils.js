/*
 * @flow
 */

const ORGANIZATION_ID :string = 'organization_id';

/*
 * https://github.com/mixer/uuid-validate
 * https://github.com/chriso/validator.js
 *
 * this regular expression comes from isUUID() from the validator.js library. isUUID() defaults to checking "all"
 * versions, but that means we lose validation against a specific version. for example, the regular expression returns
 * true for '00000000-0000-0000-0000-000000000000', but this UUID is technically not valid.
 */
const BASE_UUID_PATTERN :RegExp = /^[0-9A-F]{8}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{4}-[0-9A-F]{12}$/i;

function isValidUuid(value :any) :boolean {

  return BASE_UUID_PATTERN.test(value);
}

function randomStringId() :string {

  // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
  // https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
  // not meant to be a cryptographically strong random id
  return Math.random().toString(36).slice(2) + (new Date()).getTime().toString(36);
}

function storeOrganizationId(organizationId :?string) :void {

  if (!organizationId || !isValidUuid(organizationId)) {
    return;
  }
  localStorage.setItem(ORGANIZATION_ID, organizationId);
}

export {
  isValidUuid,
  randomStringId,
  storeOrganizationId,
};
