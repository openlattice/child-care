/*
 * @flow
 */
/* eslint-disable import/prefer-default-export */
import { DAYS_OF_WEEK } from '../../DataConstants';
import { en, es } from './Languages';

export const LABELS :Object = {
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
    /* eslint-disable-next-line */
    [en]: 'If you’re having trouble getting in touch with a care provider or have a general question, please consider contacting one of the following resources:',
    /* eslint-disable-next-line */
    [es]: 'Si tiene problemas para ponerse en contacto con un proveedor de atención médica o tiene una pregunta general, considere comunicarse con uno de los siguientes recursos:'
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
