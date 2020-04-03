// @flow
import axios from 'axios';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import {
  call,
  put,
  select,
  takeEvery
} from '@redux-saga/core/effects';
import {
  Map,
  fromJS,
  getIn
} from 'immutable';
import {
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_GEO_OPTIONS,
  GET_LB_LOCATIONS_NEIGHBORS,
  GET_LB_STAY_AWAY_PEOPLE,
  SEARCH_LOCATIONS,
  getGeoOptions,
  getLBLocationsNeighbors,
  getLBStayAwayPeople,
  searchLocations,
} from './providers/LocationsActions';

import Logger from '../../utils/Logger';
import * as FQN from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getPropertyTypeId, getESIDsFromApp, getProvidersESID } from '../../utils/AppUtils';
import { getEKIDsFromEntryValues, mapFirstEntityDataFromNeighbors } from '../../utils/DataUtils';
import { PROPERTY_TYPES } from '../../utils/constants/DataModelConstants';
import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';

const { executeSearch, searchEntityNeighborsWithFilter } = SearchApiActions;
const { executeSearchWorker, searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const {
  FILED_FOR_FQN,
  STAY_AWAY_LOCATION_FQN,
  PEOPLE_FQN,
  SERVED_WITH_FQN,
  SERVICES_OF_PROCESS_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('LocationsSagas');

const GEOCODER_URL_PREFIX = 'https://osm.openlattice.com/nominatim/search/';
const GEOCODER_URL_SUFFIX = '?format=json';

function* getGeoOptionsWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    yield put(getGeoOptions.request(action.id));

    const response = yield call(axios, {
      method: 'get',
      url: `${GEOCODER_URL_PREFIX}${window.encodeURI(action.value)}${GEOCODER_URL_SUFFIX}`
    });

    const formattedOptions = response.data.map((option) => {
      // eslint-disable-next-line camelcase
      const { display_name, lat, lon } = option;
      return {
        ...option,
        label: display_name,
        value: `${lat},${lon}`
      };
    });

    yield put(getGeoOptions.success(action.id, fromJS(formattedOptions)));
  }
  catch (error) {
    yield put(getGeoOptions.failure(action.id, error));
  }
  finally {
    yield put(getGeoOptions.finally(action.id));
  }
}

function* getGeoOptionsWatcher() :Generator<*, *, *> {
  yield takeEvery(GET_GEO_OPTIONS, getGeoOptionsWorker);
}

function* getLBStayAwayPeopleWorker(action :SequenceAction) :Generator<any, any, any> {
}

function* getLBStayAwayPeopleWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_LB_STAY_AWAY_PEOPLE, getLBStayAwayPeopleWorker);
}

function* getLBLocationsNeighborsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response :Object = {
    data: {}
  };

  try {
    const { value: entityKeyIds } = action;
    if (!isArray(entityKeyIds)) throw ERR_ACTION_VALUE_TYPE;
    yield put(getLBLocationsNeighbors.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const [
      filedForESID,
      locationESID,
      serviceOfProcessESID
    ] = getESIDsFromApp(app, [
      FILED_FOR_FQN,
      STAY_AWAY_LOCATION_FQN,
      SERVICES_OF_PROCESS_FQN
    ]);

    const stayAwayParams = {
      entitySetId: locationESID,
      filter: {
        entityKeyIds,
        edgeEntitySetIds: [filedForESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [serviceOfProcessESID],
      }
    };

    const stayAwayResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(stayAwayParams)
    );

    if (stayAwayResponse.error) throw stayAwayResponse.error;

    const stayAway = mapFirstEntityDataFromNeighbors(fromJS(stayAwayResponse.data));
    const stayAwayEKIDs = getEKIDsFromEntryValues(stayAway).toJS();

    response.data = {
      stayAway
    };

    if (stayAwayEKIDs.length) {
      const peopleResponse = yield call(
        getLBStayAwayPeopleWorker,
        getLBStayAwayPeople(stayAwayEKIDs)
      );
      if (peopleResponse.error) throw peopleResponse.error;

      response.data = {
        ...response.data,
        ...peopleResponse.data
      };
    }

    yield put(getLBLocationsNeighbors.success(action.id, response));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getLBLocationsNeighbors.failure(action.id));
  }

  return response;
}

function* getLBLocationsNeighborsWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_LB_LOCATIONS_NEIGHBORS, getLBLocationsNeighborsWorker);
}

function* searchLocationsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {
    data: {}
  };

  try {
    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchInputs, start = 0, maxHits = 20 } = value;
    const latitude :string = searchInputs.getIn(['selectedOption', 'lat']);
    const longitude :string = searchInputs.getIn(['selectedOption', 'lon']);

    yield put(searchLocations.request(action.id, searchInputs));

    const app = yield select((state) => state.get('app', Map()));

    const entitySetId = getProvidersESID(app);
    const locationCoordinatesPTID = getPropertyTypeId(app, PROPERTY_TYPES.LOCATION);

    const searchOptions = {
      start,
      entitySetIds: [entitySetId],
      maxHits,
      constraints: [{
        constraints: [{
          type: 'geoDistance',
          latitude,
          longitude,
          propertyTypeId: locationCoordinatesPTID,
          radius: 400,
          unit: 'yd'
        }]
      }],
    };

    const { data, error } = yield call(
      executeSearchWorker,
      executeSearch({ searchOptions })
    );

    if (error) throw error;

    const { hits, numHits } = data;
    const locationsEKIDs = hits.map((location) => getIn(location, [FQN.OPENLATTICE_ID_FQN, 0]));
    const locationsByEKID = Map(hits.map((entity) => [getIn(entity, [FQN.OPENLATTICE_ID_FQN, 0]), fromJS(entity)]));
    response.data.hits = fromJS(locationsEKIDs);
    response.data.totalHits = numHits;
    response.data.providerLocations = locationsByEKID;

    yield put(searchLocations.success(action.id, response.data));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(searchLocations.failure(action.id));
  }

  return response;
}

function* searchLocationsWatcher() :Generator<any, any, any> {
  yield takeEvery(SEARCH_LOCATIONS, searchLocationsWorker);
}

export {
  getGeoOptionsWatcher,
  getGeoOptionsWorker,
  getLBLocationsNeighborsWatcher,
  getLBLocationsNeighborsWorker,
  getLBStayAwayPeopleWatcher,
  getLBStayAwayPeopleWorker,
  searchLocationsWatcher,
  searchLocationsWorker,
};
