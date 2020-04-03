// @flow
import { combineReducers } from 'redux-immutable';

import encampment from './encampment/EncampmentsReducer';
import stayaway from './stayaway/LongBeachLocationsReducer';

const subReducers = combineReducers({
  encampment,
  stayaway,
});

export default subReducers;
