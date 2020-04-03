/*
 * @flow
 */

import qs from 'query-string';

type Location = {
  hash :string
};

const getSplitStr = (location :Location) :string[] => {
  const splitStr = location ? location.hash.split('/') : [];
  if (splitStr[0] && splitStr[0] === '#') splitStr[0] = '';
  return splitStr;
};

const getPage = (splitStr :string[]) :number => {
  const page = splitStr[splitStr.length - 1];
  return parseInt(page, 10);
};

export const getCurrentPage = (location :Location) :number => getPage(getSplitStr(location));

export const getNextPath = (location :Location, numPages :number) :?string => {
  const splitStr = getSplitStr(location);
  const page = getPage(splitStr);
  const nextPage = page + 1;
  splitStr[splitStr.length - 1] = `${nextPage}`;
  return nextPage <= numPages ? splitStr.join('/') : null;
};

export const getPrevPath = (location :Location) :?string => {
  const splitStr = getSplitStr(location);
  const page = getPage(splitStr);
  const prevPage = page - 1;
  splitStr[splitStr.length - 1] = `${prevPage}`;
  return prevPage >= 1 ? splitStr.join('/') : null;
};

export const getIsLastPage = (location :Location, numPages :?number) :boolean => {
  const splitStr = getSplitStr(location);
  return getPage(splitStr) === numPages;
};

export const INCOMPLETE = 'incomplete';

export const showInvalidFields = (location :Location) => {
  const hashSplit = location.hash.split('?');
  if (hashSplit.length > 1) {
    const params = qs.parse(hashSplit[1]);
    return !!params[INCOMPLETE];
  }
  return false;
};

export const setShowInvalidFields = (location :Location) => {
  const splitStr = getSplitStr(location);
  return `${splitStr.join('/')}?${qs.stringify({ [INCOMPLETE]: true })}`;
};
