/*
 * @flow
 */
/* eslint-disable import/prefer-default-export */
import { en, es } from './Languages';

export const NO_RESULTS :Object = {
  DETAILS_WITH_ZIP: {
    [en]: 'We couldn’t find any childcare facilities within these search parameters. Please refine your search or '
    + 'contact your local Resource & Referral agency:',
    [es]: 'No pudimos encontrar ninguna guardería dentro de estos parámetros de búsqueda. Refine su búsqueda o '
    + 'comuníquese con su agencia local de Recursos y Referencias:'
  },
  DETAILS_WITHOUT_ZIP: {
    [en]: 'We couldn’t find any childcare facilities within these search parameters. Please refine your search or '
    + 'contact your local Resource & Referral agency. Listed below are referral agencies based on their physical '
    + 'distance from the location you searched. To yeild more accurate results for agencies serving your area, '
    + 'include your zip code in your search.',
    [es]: 'No pudimos encontrar ninguna guardería dentro de estos parámetros de búsqueda. Refine su búsqueda o '
    + 'comuníquese con su agencia local de Recursos y Referencias. A continuación se enumeran las agencias de '
    + 'referencia según su distancia física desde la ubicación que buscó. Para obtener resultados más precisos '
    + 'para las agencias que prestan servicios en su área, incluya su código postal en su búsqueda.'
  },
};
