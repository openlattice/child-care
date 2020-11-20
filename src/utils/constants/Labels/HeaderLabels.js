import { PROVIDERS } from '../StateConstants';
import { en, es } from './Languages';
import { LABELS } from './General';

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
