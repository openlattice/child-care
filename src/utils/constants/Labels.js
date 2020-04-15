import {
  DAYS_OF_WEEK,
  CLIENTS_SERVED,
  FACILITY_TYPES,
  FACILITY_NAME_MASKED
} from '../DataConstants';
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
  BACK: {
    [en]: 'Back',
    [es]: 'Atrás'
  },
  BACK_TO_SEARCH_RESULTS: {
    [en]: 'Back to search results',
    [es]: 'Atrás'
  },
  BASIC_SEARCH: {
    [en]: 'Basic Search',
    [es]: 'Búsqueda Básica'
  },
  CAPACITY: {
    [en]: 'Capacity',
    [es]: 'Capacidad'
  },
  CHILD: {
    [en]: 'Child',
    [es]: 'Niño'
  },
  CHILDREN: {
    [en]: 'Children',
    [es]: 'Niños'
  },
  CLOSED: {
    [en]: 'Closed',
    [es]: 'Cerrado'
  },
  CLOSED_DURING_COVID: {
    [en]: 'Closed during COVID-19',
    [es]: 'Cerrado Durante COVID-19'
  },
  CONTACT: {
    [en]: 'Contact',
    [es]: 'Contacto'
  },
  CONTACT_RR_FOR_INFO: {
    [en]: 'Exact location can be provided by this facility’s Resource and Referral Affiliate.',
    [es]: 'El afiliado de Recurso y Referencia de este proveedor puede proporcionar la ubicación exacta.'
  },
  COMPLAINTS: {
    [en]: 'Complaints',
    [es]: 'Quejas'
  },
  COMPLAINTS_DESCRIPTION: {
    [en]: 'This number represents the total complaints in the last 12 months.',
    [es]: 'Este número representa el total de quejas en los últimos 12 meses.'
  },
  CURRENT_LOCATION: {
    [en]: 'Current Location',
    [es]: 'Ubicación Presente'
  },
  DAYS_NEEDED: {
    [en]: 'Days Needed',
    [es]: 'Días Necesarios'
  },
  DEVELOPMENTALLY_DISABLED: {
    [en]: 'Developmentally Disabled',
    [es]: 'Discapacidad del Desarrollo'
  },
  FACILITY_NAME_MASKED: {
    [en]: 'Small Family Home',
    [es]: 'Pequeño Hogar Familiar'
  },
  HEALTH_AND_SAFETY: {
    [en]: 'Health & Safety',
    [es]: 'Salud & Seguridad'
  },
  LAST_INSPECTION_DATE: {
    [en]: 'Last Inspection Date',
    [es]: 'Fecha de Última Inspección'
  },
  LICENSE_NUMBER: {
    [en]: 'License Number',
    [es]: 'Número de Licencia'
  },
  NEAREST_HOSPITAL: {
    [en]: 'Nearest Hospital',
    [es]: 'Hospital Más Cercano'
  },
  NO: {
    [en]: 'No',
    [es]: 'No'
  },
  NOT_LICENSED: {
    [en]: 'Not Licensed',
    [es]: 'No Licenciado'
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
  PRIVACY_POLICY: {
    [en]: 'Privacy Policy',
    [es]: 'Política de Privacidad'
  },
  REFINE_SEARCH: {
    [en]: 'Refine Search',
    [es]: 'Refina Búsqueda'
  },
  RESOURCE_AND_REFERRAL: {
    [en]: 'Referral',
    [es]: 'Referencia'
  },
  RESOURCE_AND_REFERRAL_DESCRIPTION: {
    [en]: 'If you have questions about this provider, the following affiliates may be able to help you:',
    [es]: 'Si tienes preguntas sobre este proveedor, los siguientes afiliados pueden ayudarlo:'
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
  SHOW_INACTIVE_FACILITIES: {
    [en]: 'Show inactive facilities?',
    [es]: '¿Mostrar instalaciones inactivas?'
  },
  SORT_BY: {
    [en]: 'Sort by distance',
    [es]: 'Ordena por distancia'
  },
  SPOT: {
    [en]: 'Spot',
    [es]: 'Espacio'
  },
  TERMS_AND_CONDITIONS: {
    [en]: 'Terms & Conditions',
    [es]: 'Términos y Condiciones'
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
    [es]: 'Dato Desconocido'
  },
  UNKNOWN_AGE_LIMITATIONS: {
    [en]: 'Unknown age limitations',
    [es]: 'Limitaciones de edad desconocida'
  },
  VIEW_PROVIDER: {
    [en]: 'View Provider',
    [es]: 'Ver Proveedor'
  },
  YES: {
    [en]: 'Yes',
    [es]: 'Sí'
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
  [PROVIDERS.ACTIVE_ONLY]: LABELS.SHOW_INACTIVE_FACILITIES,
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

export const CURRENT_LANGUAGE = {
  [en]: en,
  [es]: es
};

export const AGES_SERVED_LABELS = {
  [CLIENTS_SERVED.CHILDREN]: LABELS.AGE_SCHOOL,
  [CLIENTS_SERVED.INFANTS]: LABELS.AGE_INFANT,
  [CLIENTS_SERVED.TODDLERS]: LABELS.AGE_TODDLER,
  [CLIENTS_SERVED.DEVELOPMENTALLY_DISABLED]: LABELS.DEVELOPMENTALLY_DISABLED
};

export const FACILITY_TYPE_LABELS = {
  [FACILITY_TYPES.FAMILY_HOME]: {
    [en]: 'Family Home',
    [es]: 'Casa Familiar'
  },
  [FACILITY_TYPES.DAY_CARE_CENTER]: {
    [en]: 'Child Care Center',
    [es]: 'Guardería'
  }
};
