/*
 * @flow
 */

export const isNotNumber = (number :string | number) :boolean => {
  if (number === null || number === undefined) return true;
  let formattedStr = `${number}`;
  const suffix = formattedStr.match(/\.0*$/);
  if (suffix) {
    formattedStr = formattedStr.slice(0, suffix.index);
  }
  const floatVal = Number.parseFloat(formattedStr);
  return Number.isNaN(floatVal) || floatVal.toString() !== formattedStr;
};

export const isNotInteger = (number :string | number) :boolean => {
  if (number === null || number === undefined) return true;
  const numberStr = `${number}`;
  const intVal = parseInt(numberStr, 10);
  return Number.isNaN(intVal) || intVal.toString() !== numberStr;
};
