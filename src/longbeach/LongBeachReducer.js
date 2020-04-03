// @flow
import { combineReducers } from 'redux-immutable';

import locations from '../containers/location/LocationsReducer';
import providers from './provider/LongBeachProviderReducer';

const subReducers = combineReducers({
  locations,
  providers
});

export default subReducers;
