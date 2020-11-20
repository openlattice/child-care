/*
 * @flow
 */

export const LANGUAGES :Object = {
  en: 'en',
  es: 'es'
};

export const { en, es } = LANGUAGES;

export const OTHER_LANGUAGE :Object = {
  [en]: es,
  [es]: en
};

export const CURRENT_LANGUAGE :Object = {
  [en]: en,
  [es]: es
};
