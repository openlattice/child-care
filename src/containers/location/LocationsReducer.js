// @flow
import { combineReducers } from 'redux-immutable';

import stayaway from './providers/LocationsReducer';

const subReducers = combineReducers({
  stayaway,
});

export default subReducers;
