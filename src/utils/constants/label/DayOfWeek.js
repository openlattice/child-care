/*
 * @flow
 */
/* eslint-disable import/prefer-default-export */
import { DAYS_OF_WEEK } from '../../DataConstants';
import { en, es } from './Languages';

export const DAY_OF_WEEK_LABELS = {
  [DAYS_OF_WEEK.SUNDAY]: {
    [en]: 'Sunday',
    [es]: 'Domingo'
  },
  [DAYS_OF_WEEK.MONDAY]: {
    [en]: 'Monday',
    [es]: 'Lunes'
  },
  [DAYS_OF_WEEK.TUESDAY]: {
    [en]: 'Tuesday',
    [es]: 'Martes'
  },
  [DAYS_OF_WEEK.WEDNESDAY]: {
    [en]: 'Wednesday',
    [es]: 'Miércoles'
  },
  [DAYS_OF_WEEK.THURSDAY]: {
    [en]: 'Thursday',
    [es]: 'Jueves'
  },
  [DAYS_OF_WEEK.FRIDAY]: {
    [en]: 'Friday',
    [es]: 'Viernes'
  },
  [DAYS_OF_WEEK.SATURDAY]: {
    [en]: 'Saturday',
    [es]: 'Sábado'
  }
};
