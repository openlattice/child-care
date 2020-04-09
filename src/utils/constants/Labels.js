import { DAYS_OF_WEEK } from '../DataConstants';
import { PROVIDERS } from './StateConstants';

export const LANGUAGES = {
  en: 'en',
  es: 'es'
};

export const { en, es } = LANGUAGES;

export const LABELS = {
  ADDRESS: {
    [en]: 'Address',
    [es]: 'Dirección'
  },
  ADVANCED_SEARCH: {
    [en]: 'Advanced Search',
    [es]: 'Búsqueda Avanzada'
  },
  AGE_INFANT: {
    [en]: 'Infant (0 - 2 yrs)',
    [es]: 'Bebé (0 - 2 a)'
  },
  AGE_SCHOOL: {
    [en]: 'School age (5+ yrs)',
    [es]: 'Niño (5+ a)'
  },
  AGE_TODDLER: {
    [en]: 'Toddler (2 - 5 yrs)',
    [es]: 'Niño pequeño (2 - 5 a)'
  },
  ANY: {
    [en]: 'Any',
    [es]: 'Alguno'
  },
  APPLY: {
    [en]: 'Apply',
    [es]: 'Confirma'
  },
  CLOSED: {
    [en]: 'Closed',
    [es]: 'Cerrado'
  },
  BACK_TO_SEARCH_RESULTS: {
    [en]: 'Back to search results',
    [es]: 'Atrás'
  },
  BASIC_SEARCH: {
    [en]: 'Basic Search',
    [es]: 'Búsqueda Básica'
  },
  CONTACT: {
    [en]: 'Contact',
    [es]: 'Contacto'
  },
  CURRENT_LOCATION: {
    [en]: 'Current Location',
    [es]: 'Ubicación Presente'
  },
  DAYS_NEEDED: {
    [en]: 'Days Needed',
    [es]: 'Días Necesarios'
  },
  NUMBER_OF_CHILDREN: {
    [en]: 'Number of Children',
    [es]: 'Numero de niños'
  },
  OPEN: {
    [en]: 'Open',
    [es]: 'Abierto'
  },
  OPERATING_HOURS: {
    [en]: 'Operating Hours',
    [es]: 'Horario'
  },
  MILE: {
    [en]: 'mile',
    [es]: 'milla'
  },
  PHONE: {
    [en]: 'Phone',
    [es]: 'Teléfono'
  },
  POINT_OF_CONTACT: {
    [en]: 'Point of Contact',
    [es]: 'Punto de Contacto'
  },
  REFINE_SEARCH: {
    [en]: 'Refine Search',
    [es]: 'Refina Búsqueda'
  },
  SAVE: {
    [en]: 'Save',
    [es]: 'Guarda'
  },
  SEARCH_LOCATIONS: {
    [en]: 'Search Locations',
    [es]: 'Ubicaciones de Búsqueda'
  },
  SEARCH_PARAMETERS: {
    [en]: 'Search Parameters',
    [es]: 'Parámetros de Búsqueda'
  },
  SEARCH_RADIUS: {
    [en]: 'Search Radius',
    [es]: 'Radio de Búsqueda'
  },
  SEARCH_RESULTS: {
    [en]: 'Search Results',
    [es]: 'Resultados de Búsqueda'
  },
  SELECT: {
    [en]: 'Select...',
    [es]: 'Selecciona...'
  },
  SELECT_ALL: {
    [en]: 'Select all that apply:',
    [es]: 'Selecciona todos los que correspondan:'
  },
  SORT_BY: {
    [en]: 'Sort by relevance',
    [es]: 'Ordena por relevancia'
  },
  TYPE_OF_CARE: {
    [en]: 'Type of Care',
    [es]: 'Tipo de Cuidado'
  },
  TYPES_SELECTED: {
    [en]: 'types selected',
    [es]: 'tipos seleccionados'
  },
  UNKNOWN: {
    [en]: 'Unknown',
    [es]: 'Desconocida'
  },
  UNKNOWN_AGE_LIMITATIONS: {
    [en]: 'Unknown age limitations',
    [es]: 'Limitaciones de edad indisponible'
  },
  VIEW_PROVIDER: {
    [en]: 'View Provider',
    [es]: 'Ver Proveedor'
  },
  YR: {
    [en]: 'yr',
    [es]: 'a'
  },
  YR_AND_UP: {
    [en]: 'yr and up',
    [es]: 'a y mayor'
  },
  ZIP_CODE: {
    [en]: 'ZIP Code',
    [es]: 'Código Postal'
  },


  [DAYS_OF_WEEK.SUNDAY]: {
    [en]: 'Sun',
    [es]: 'dom'
  },
  [DAYS_OF_WEEK.MONDAY]: {
    [en]: 'Mon',
    [es]: 'lun'
  },
  [DAYS_OF_WEEK.TUESDAY]: {
    [en]: 'Tue',
    [es]: 'mar'
  },
  [DAYS_OF_WEEK.WEDNESDAY]: {
    [en]: 'Wed',
    [es]: 'mie'
  },
  [DAYS_OF_WEEK.THURSDAY]: {
    [en]: 'Thu',
    [es]: 'jue'
  },
  [DAYS_OF_WEEK.FRIDAY]: {
    [en]: 'Fri',
    [es]: 'vie'
  },
  [DAYS_OF_WEEK.SATURDAY]: {
    [en]: 'Sat',
    [es]: 'sab'
  }
};

export const HEADER_LABELS = {
  [PROVIDERS.TYPE_OF_CARE]: LABELS.TYPE_OF_CARE,
  [PROVIDERS.ZIP]: LABELS.ZIP_CODE,
  [PROVIDERS.RADIUS]: LABELS.SEARCH_RADIUS,
  [PROVIDERS.CHILDREN]: {
    [en]: 'How many children do you need care for?',
    [es]: '¿Cuantos niños necesitan cuidado?'
  },
  [PROVIDERS.DAYS]: {
    [en]: 'When do you need care?',
    [es]: '¿Cuándo necesitas cuidado?'
  }
};

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

export const OTHER_LANGUAGE = {
  [en]: es,
  [es]: en
};
