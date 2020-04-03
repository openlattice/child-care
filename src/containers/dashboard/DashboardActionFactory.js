/*
 * @flow
 */

import { newRequestSequence } from 'redux-reqseq';
import type { RequestSequence } from 'redux-reqseq';

const LOAD_DASHBOARD_DATA :'LOAD_DASHBOARD_DATA' = 'LOAD_DASHBOARD_DATA';
const loadDashboardData :RequestSequence = newRequestSequence(LOAD_DASHBOARD_DATA);

export {
  LOAD_DASHBOARD_DATA,
  loadDashboardData
};
