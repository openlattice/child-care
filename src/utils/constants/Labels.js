import { PROVIDERS } from './StateConstants';

import {
  CLIENTS_SERVED,
  DAYS_OF_WEEK,
  FACILITY_TYPES
} from '../DataConstants';

export const LANGUAGES = {
  en: 'en',
  es: 'es'
};

export const { en, es } = LANGUAGES;

export const LABELS = {
  ABOUT: {
    [en]: 'About',
    [es]: 'Acerca de esta herramienta'
  },
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
    [es]: 'Bebés (0 - 2 años)'
  },
  AGE_SCHOOL: {
    [en]: 'Child (2+ yrs)',
    [es]: 'Niños (2+ años)'
  },
  AGE_TODDLER: {
    [en]: 'Toddler (2 - 5 yrs)',
    [es]: 'Niños pequeños (2 - 5 años)'
  },
  ANY: {
    [en]: 'Any',
    [es]: 'Cualquier edad'
  },
  APPLY: {
    [en]: 'Apply',
    [es]: 'Confirmar'
  },
  AS_OF: {
    [en]: 'as of',
    [es]: 'al'
  },
  AVAILABILITY: {
    [en]: 'Availability',
    [es]: 'Disponibilidad'
  },
  AVAILABILITY_UNKNOWN: {
    [en]: 'Availability Unknown',
    [es]: 'Disponibilidad desconocida'
  },
  BACK: {
    [en]: 'Back',
    [es]: 'Atrás'
  },
  BACK_TO_SEARCH_RESULTS: {
    [en]: 'Back to search results',
    [es]: 'Volver a los resultados'
  },
  BASIC_SEARCH: {
    [en]: 'Basic Search',
    [es]: 'Búsqueda rápida'
  },
  BOOKED: {
    [en]: 'Booked',
    [es]: 'Lleno'
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
    [es]: 'niños'
  },
  CITATIONS: {
    [en]: 'Type A Citations',
    [es]: 'Citas tipo A'
  },
  CITATIONS_INFO: {
    [en]: 'Immediate Health, Safety, or Personal Rights Impact',
    [es]: 'Impacto inmediato en la salud, la seguridad o los derechos personales'
  },
  CLOSED: {
    [en]: 'Closed',
    [es]: 'Cerrado'
  },
  CLOSED_DURING_COVID: {
    [en]: 'Closed during COVID-19',
    [es]: 'Cerrado durante la COVID-19'
  },
  CONTACT: {
    [en]: 'Contact',
    [es]: 'Contacto'
  },
  CONTACT_RR_FOR_INFO: {
    [en]: 'Exact location can be provided by this facility’s Resource and Referral Affiliate.',
    [es]: 'El afiliado de recursos y derivaciones de este establecimiento puede proporcionar la ubicación exacta.'
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
    [es]: 'Ubicación actual'
  },
  DAYS_NEEDED: {
    [en]: 'Days Needed',
    [es]: 'Días necesarios'
  },
  DEVELOPMENTALLY_DISABLED: {
    [en]: 'Developmentally Disabled',
    [es]: 'Discapacidades del desarrollo'
  },
  EMAIL: {
    [en]: 'Email',
    [es]: 'Correo electrónico'
  },
  ENSURE_LOCATION_DESCRIPTION: {
    [en]: 'Please ensure location services are enabled to use your current location',
    [es]: 'Asegúrese de que los servicios de localización estén habilitados para usar su ubicación actual'
  },
  ENTER_NAME_ADDRESS_ZIP: {
    [en]: 'Enter Name, Address, or ZIP',
    [es]: 'Nombre, dirección o código postal'
  },
  FACILITY_NAME_MASKED: {
    [en]: 'Small Family Home',
    [es]: 'Hogar familiar pequeño'
  },
  FIND_CHILDCARE: {
    [en]: 'Find Childcare',
    [es]: 'Encontrar cuidado infantil'
  },
  HEALTH_AND_SAFETY: {
    [en]: 'Health & Safety',
    [es]: 'Salud y seguridad'
  },
  LAST_INSPECTION_DATE: {
    [en]: 'Last Inspection Date',
    [es]: 'Fecha de la última inspección'
  },
  LAST_UPDATED: {
    [en]: 'Last Updated:',
    [es]: 'Última actualización'
  },
  LICENSE_NUMBER: {
    [en]: 'License Number',
    [es]: 'Número de licencia'
  },
  NEAREST_HOSPITAL: {
    [en]: 'Nearest Hospital',
    [es]: 'Hospital más cercano'
  },
  NO: {
    [en]: 'No',
    [es]: 'No'
  },
  NOT_LICENSED: {
    [en]: 'Not Licensed',
    [es]: 'No tiene licencia'
  },
  NUMBER_OF_CHILDREN: {
    [en]: 'Number of Children',
    [es]: 'Número de niños'
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
    [es]: 'Punto de contacto'
  },
  PRIVACY_POLICY: {
    [en]: 'Privacy Policy',
    [es]: 'Política de privacidad'
  },
  REFINE_SEARCH: {
    [en]: 'Refine Search',
    [es]: 'Refinar la búsqueda'
  },
  RESOURCES: {
    [en]: 'Resources',
    [es]: 'Recursos'
  },
  RESOURCES_DESCRIPTIONS: {
    [en]: 'If you’re having trouble getting in touch with a care provider or have a general question, '
    + 'please consider contacting one of the following resources:',
    [es]: 'Si tiene problemas para ponerse en contacto con un proveedor de atención médica o tiene una pregunta '
    + 'general, considere comunicarse con uno de los siguientes recursos:'
  },
  RESOURCE_AND_REFERRAL: {
    [en]: 'Resource & Referral Agency',
    [es]: 'Oficina de recursos y derivaciones'
  },
  RESOURCE_AND_REFERRAL_DESCRIPTION: {
    [en]: 'If you have questions about this provider, the following affiliates may be able to help you:',
    [es]: 'Si tiene preguntas sobre este proveedor, los siguientes afiliados pueden ayudarlo:'
  },
  SAVE: {
    [en]: 'Save',
    [es]: 'Guardar'
  },
  SEARCH_LOCATIONS: {
    [en]: 'Search Locations',
    [es]: 'Buscar en una zona específica'
  },
  SEARCH_PARAMETERS: {
    [en]: 'Search Parameters',
    [es]: 'Parámetros de la búsqueda'
  },
  SEARCH_RADIUS: {
    [en]: 'Search Radius',
    [es]: 'Radio de búsqueda'
  },
  SEARCH_RESULTS: {
    [en]: 'Search Results',
    [es]: 'Resultados de la búsqueda'
  },
  SELECT: {
    [en]: 'Select...',
    [es]: 'Seleccionar...'
  },
  SELECT_ALL: {
    [en]: 'Select all that apply:',
    [es]: 'Seleccione todos los que correspondan:'
  },
  SEND_FEEDBACK: {
    [en]: 'Send Feedback',
    [es]: 'Envíenos sus comentarios'
  },
  SEND_FEEDBACK_SUBJECT: {
    [en]: 'MyChildCare.ca.gov user feedback',
    [es]: 'Comentarios del usuario acerca de MyChildCare.ca.gov'
  },
  SHOW_INACTIVE_FACILITIES: {
    [en]: 'Show Inactive Facilities',
    [es]: 'Mostrar instalaciones inactivas'
  },
  SORT_BY: {
    [en]: 'Sort by distance',
    [es]: 'Ordenar por distancia'
  },
  SPOT: {
    [en]: 'Spot',
    [es]: 'Espacio'
  },
  SPOTS_OPEN: {
    [en]: 'Spots Open',
    [es]: 'Plazas disponibles'
  },
  TERMS_AND_CONDITIONS: {
    [en]: 'Terms & Conditions',
    [es]: 'Términos y condiciones'
  },
  TYPE_OF_CARE: {
    [en]: 'Type of Care',
    [es]: 'Tipo de cuidado'
  },
  TYPES_SELECTED: {
    [en]: 'types selected',
    [es]: 'tipos seleccionados'
  },
  UNKNOWN: {
    [en]: 'Unknown',
    [es]: 'Dato desconocido'
  },
  UNKNOWN_AGE_LIMITATIONS: {
    [en]: 'Unknown age limitations',
    [es]: 'Limitaciones de edad desconocida'
  },
  USE_CURRENT_LOCATION: {
    [en]: 'Use my current location',
    [es]: 'Usar mi ubicación actual'
  },
  VIEW_PROVIDER: {
    [en]: 'View Provider',
    [es]: 'Ver proveedor'
  },
  WELCOME_TEXT: {
    [en]: 'Welcome to MyChildCare.ca.gov',
    [es]: 'Bienvenido a MyChildCare.ca.gov'
  },
  YES: {
    [en]: 'Yes',
    [es]: 'Sí'
  },
  YR: {
    [en]: 'yr',
    [es]: 'año'
  },
  YR_AND_UP: {
    [en]: 'yr and up',
    [es]: 'año y mayor'
  },
  ZIP_CODE: {
    [en]: 'ZIP Code',
    [es]: 'Código postal'
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
    [es]: 'sáb'
  }
};

export const HEADER_LABELS = {
  [PROVIDERS.ACTIVE_ONLY]: LABELS.SHOW_INACTIVE_FACILITIES,
  [PROVIDERS.TYPE_OF_CARE]: LABELS.TYPE_OF_CARE,
  [PROVIDERS.ZIP]: LABELS.ZIP_CODE,
  [PROVIDERS.RADIUS]: LABELS.SEARCH_RADIUS,
  [PROVIDERS.CHILDREN]: {
    [en]: 'How many children do you need care for?',
    [es]: '¿Cuántos niños necesitan cuidado?'
  },
  [PROVIDERS.DAYS]: {
    [en]: 'When do you need care?',
    [es]: '¿Cuándo necesita cuidado?'
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
    [es]: 'Casa familiar'
  },
  [FACILITY_TYPES.DAY_CARE_CENTER]: {
    [en]: 'Child Care Center',
    [es]: 'Centro de cuidado infantil'
  }
};

export const ABOUT = {
  INTRO: {
    [en]: 'This tool is a COVID-19 joint collaboration between ',
    [es]: 'Esta herramienta es el resultado de una colaboración entre '
  },
  AND: {
    [en]: 'and',
    [es]: 'y'
  },
  CRAFTED_WITH_LOVE: {
    [en]: 'Crafted with care in Redwood City by:',
    [es]: 'Hecho con cuidado en Redwood City por:'
  },
  DATA_COLLECTION: {
    [en]: 'Data collection and cleaning provided by:',
    [es]: 'Recolección y limpieza de datos proporcionadas por:'
  },
  INFRASTRUCTURE_PARNERS: {
    [en]: 'A very special thank you to our infrastructure partners:',
    [es]: 'Un agradecimiento muy especial a nuestros socios de infraestructura:'
  }
};

export const UNSUPPORTED_BROWSER = {
  HEADER: {
    [en]: 'It looks like you\'re using an unsupported browser!',
    [es]: '¡Parece que está usando un navegador incompatible!'
  },
  SUGGESTION: {
    [en]: 'Try opening MyChildCare.ca.gov in another browser (such as Chrome) to find childcare near you.',
    [es]: 'Abra MyChildCare.ca.gov en otro navegador (como Chrome) para encontrar cuidado infantil cercano.'
  }
};

export const WELCOME_SPLASH = {
  WELCOME: {
    [en]: 'Welcome to MyChildCare.ca.gov!',
    [es]: '¡Bienvenido a MyChildCare.ca.gov!'
  },
  DETAILS: {
    [en]: 'Here you can find information on licensed childcare providers that are currently open including location, '
    + 'health and safety details, ages of children served, capacity, and hours of care.',
    [es]: 'Aquí puede encontrar información sobre proveedores de cuidado infantil licenciados que están abiertos, '
    + 'incluyendo su ubicación, detalles de salud y seguridad, las edades de los niños bajo cuidado, su capacidad y '
    + 'las horas de cuidado.'
  },
  INSTRUCTIONS_1: {
    [en]: 'Enter an address in the search bar or ',
    [es]: 'Ingrese una dirección en la barra de búsqueda o '
  },
  USE_CURRENT_LOCATION_LINK: {
    [en]: 'use your current location',
    [es]: 'seleccione su ubicación actual'
  },
  INSTRUCTIONS_2: {
    [en]: ' to find childcare near you.',
    [es]: ' para encontrar cuidado infantil cerca de usted.'
  },
};

export const NO_RESULTS = {
  DETAILS: {
    [en]: 'We couldn’t find any childcare facilities within these search parameters. Please refine your search or '
    + 'contact your local Resource & Referral agency:',
    [es]: 'No pudimos encontrar ninguna guardería dentro de estos parámetros de búsqueda. Refine su búsqueda o '
    + 'comuníquese con su agencia local de Recursos y Referencias:'
  },
};
