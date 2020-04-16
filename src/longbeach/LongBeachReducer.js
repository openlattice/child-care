// @flow
import { combineReducers } from 'redux-immutable';

import locations from '../containers/location/LocationsReducer';

const subReducers = combineReducers({
  locations
});

export default subReducers;
