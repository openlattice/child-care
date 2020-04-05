import { PROVIDERS } from '../../../utils/constants/StateConstants';

const STAY_AWAY_STORE_PATH = ['longBeach', 'locations', 'stayaway'];

export { STAY_AWAY_STORE_PATH };

export const FILTER_HEADERS = {
  [PROVIDERS.TYPE_OF_CARE]: 'Type of Care',
  [PROVIDERS.ZIP]: 'ZIP Code',
  [PROVIDERS.RADIUS]: 'Search Radius',
  [PROVIDERS.CHILDREN]: 'How many children do you need care for?',
  [PROVIDERS.DAYS]: 'When do you need care?',
};
