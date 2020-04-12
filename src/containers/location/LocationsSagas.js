// @flow
import axios from 'axios';
import isArray from 'lodash/isArray';
import isPlainObject from 'lodash/isPlainObject';
import {
  all,
  call,
  put,
  select,
  takeEvery
} from '@redux-saga/core/effects';
import {
  Map,
  fromJS,
  getIn,
  isImmutable
} from 'immutable';
import { DataApi, SearchApi } from 'lattice';
import { AuthUtils } from 'lattice-auth';
import {
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import { STAY_AWAY_STORE_PATH } from './providers/constants';
import {
  GET_GEO_OPTIONS,
  GET_LB_LOCATIONS_NEIGHBORS,
  GET_LB_STAY_AWAY_PEOPLE,
  LOAD_ALL_HOSPITALS,
  SEARCH_LOCATIONS,
  getGeoOptions,
  getLBLocationsNeighbors,
  getLBStayAwayPeople,
  loadAllHospitals,
  searchLocations,
} from './providers/LocationsActions';

import Logger from '../../utils/Logger';
import * as FQN from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';

import { refreshAuthTokenIfNecessary } from '../app/AppSagas';
import { getPropertyTypeId, getESIDsFromApp, getHospitalsESID, getProvidersESID } from '../../utils/AppUtils';
import {
  getEntityKeyId,
  getEKIDsFromEntryValues,
  mapFirstEntityDataFromNeighbors,
  formatTimeAsDateTime
} from '../../utils/DataUtils';
import { DAY_PTS, CLOSED, CLIENTS_SERVED } from '../../utils/DataConstants';
import { PROPERTY_TYPES, RR_ENTITY_SET_ID, HOSPITALS_ENTITY_SET_ID } from '../../utils/constants/DataModelConstants';
import { PROVIDERS } from '../../utils/constants/StateConstants';
import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';


const { executeSearch, searchEntityNeighborsWithFilter } = SearchApiActions;
const { executeSearchWorker, searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const {
  FILED_FOR_FQN,
  STAY_AWAY_LOCATION_FQN,
  SERVICES_OF_PROCESS_FQN,
} = APP_TYPES_FQNS;

const AGE_GROUP_BY_FQN = {
  [PROPERTY_TYPES.CAPACITY_UNDER_2]: CLIENTS_SERVED.INFANTS,
  [PROPERTY_TYPES.CAPACITY_2_TO_5]: CLIENTS_SERVED.TODDLERS,
  [PROPERTY_TYPES.CAPACITY_OVER_5]: CLIENTS_SERVED.CHILDREN
};

const LOG = new Logger('LocationsSagas');

const GEOCODING_API = 'https://api.openlattice.com/datastore/geocoding';

const DEFAULT_AUTOCOMPLETE_COMPONENTS = [
  {
    component: 'country',
    value: 'us'
  }
];

function* getGeoOptionsWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    yield put(getGeoOptions.request(action.id));

    yield call(refreshAuthTokenIfNecessary);

    const token = yield select((state) => state.getIn(['app', 'token']));
    const sessionToken = yield select((state) => state.getIn(['app', 'sessionId']));

    const headers = {
      Authorization: `Bearer ${token}`
    };

    const { address, currentPosition } = action.value;

    let currentLocationBias = {};
    if (currentPosition && currentPosition.coords) {
      const { latitude, longitude } = currentPosition.coords;
      currentLocationBias = {
        location: {
          lat: latitude,
          lng: longitude
        }
      };
    }

    const { data: suggestions } = yield call(axios, {
      method: 'post',
      url: `${GEOCODING_API}/autocomplete`,
      headers,
      data: {
        input: address,
        componentFilters: DEFAULT_AUTOCOMPLETE_COMPONENTS,
        sessionToken,
        ...currentLocationBias
      }
    });

    const geocoded = yield all(
      suggestions.map(({ placeId }) => call(axios, {
        method: 'post',
        url: `${GEOCODING_API}/geocode`,
        headers,
        data: { placeId, address: '' }
      }))
    );

    const formattedOptions = [].concat(...geocoded.map(({ data }) => data)).map((option, idx) => {
      // eslint-disable-next-line camelcase
      const { geometry } = option;
      const { location } = geometry;
      const { lat, lng: lon } = location;
      const { description } = suggestions[idx];

      return {
        ...option,
        label: description,
        value: `${lat},${lon}`,
        lat,
        lon
      };
    });

    yield put(getGeoOptions.success(action.id, fromJS(formattedOptions)));
  }
  catch (error) {
    console.error(error)
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

const isEmpty = (map) => {
  if (!map) return true;
  return isImmutable(map) ? map.size === 0 : Object.keys(map).length === 0;
}

function* searchLocationsWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {
    data: {}
  };

  try {

    yield call(refreshAuthTokenIfNecessary);

    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchInputs, start = 0, maxHits = 20 } = value;

    const locationState = yield select((state) => state.getIn(STAY_AWAY_STORE_PATH));
    const getValue = (field) => searchInputs.get(field, locationState.get(field));

    let latLonObj = searchInputs.get('selectedOption');
    if (isEmpty(latLonObj)) latLonObj = searchInputs.getIn([PROVIDERS.ZIP, 1]);
    if (isEmpty(latLonObj)) latLonObj = locationState.getIn(['searchInputs', 'selectedOption']);
    if (!isImmutable(latLonObj)) latLonObj = fromJS(latLonObj);

    const radius = getValue(PROVIDERS.RADIUS);
    const typeOfCare = getValue(PROVIDERS.TYPE_OF_CARE);
    const children = getValue(PROVIDERS.CHILDREN);
    const daysAndTimes = getValue(PROVIDERS.DAYS);
    const activeOnly = getValue(PROVIDERS.ACTIVE_ONLY);

    yield put(searchLocations.request(action.id, searchInputs.set('selectedOption', latLonObj)));

    const latitude :string = isImmutable(latLonObj) ? latLonObj.get('lat') : latLonObj['lat'];
    const longitude :string = isImmutable(latLonObj) ? latLonObj.get('lon') : latLonObj['lon'];

    const app :Map = yield select((state) => state.get('app', Map()));
    const entitySetId = getProvidersESID(app);

    const locationPropertyTypeId = getPropertyTypeId(app, PROPERTY_TYPES.LOCATION);

    const sort = {
      type: 'geoDistance',
      descending: true,
      propertyTypeId: locationPropertyTypeId,
      latitude,
      longitude
    };

    const locationConstraint = {
      constraints: [{
        type: 'geoDistance',
        latitude,
        longitude,
        propertyTypeId: locationPropertyTypeId,
        radius,
        unit: 'miles'
      }, {
        type: 'simple',
        fuzzy: false,
        searchTerm: `_exists_:entity.${locationPropertyTypeId}`
      }],
      min: 2
    };

    const constraints = [locationConstraint];

    if (activeOnly) {

      const isActiveConstraint = {
        constraints: [{
          type: 'simple',
          fuzzy: 'false',
          searchTerm: `NOT(entity.${getPropertyTypeId(app, PROPERTY_TYPES.STATUS)}:"${CLOSED}")`
        }]
      };

      constraints.push(isActiveConstraint);
    }

    if (typeOfCare && typeOfCare.size) {
      const propertyTypeId = getPropertyTypeId(app, PROPERTY_TYPES.FACILITY_TYPE);

      const typeOfCareConstraint = {
        constraints: typeOfCare.map(value => ({
          type: 'simple',
          searchTerm: `entity.${propertyTypeId}:"${value}"`,
          fuzzy: false
        })).toJS()
      };

      constraints.push(typeOfCareConstraint);
    }

    if (children && children.size) {

      let totalChildren = 0;
      const ageBrackets = [];
      children.entrySeq().forEach(([fqn, count]) => {
        totalChildren += count;

        if (count > 0) {
          ageBrackets.push(fqn);
        }
      });

      if (totalChildren > 0) {
        const agesPTID = getPropertyTypeId(app, PROPERTY_TYPES.AGES_SERVED);
        const capacityAgeUnknownPTID = getPropertyTypeId(app, PROPERTY_TYPES.CAPACITY_AGE_UNKNOWN);

        const searchTerm = ageBrackets.map((fqn) => `entity.${agesPTID}:"${AGE_GROUP_BY_FQN[fqn]}"`).join(' AND ');

        const childrenConstraint = {
          constraints: [
            {
              type: 'simple',
              fuzzy: false,
              searchTerm
            },
            {
              type: 'simple',
              fuzzy: false,
              searchTerm: `entity.${capacityAgeUnknownPTID}:[${totalChildren} TO *]`
            }
          ],
          min: 2
        };

        // const bucketRequirements = children.entrySeq()
        //   .filter(([_, number]) => number > 0)
        //   .map(([fqn, number]) => `entity.${getPropertyTypeId(app, fqn)}:[${number} TO *]`)
        //   .join(' AND ');
        //
        // const childrenConstraint = {
        //   constraints: [
        //     {
        //       type: 'simple',
        //       fuzzy: false,
        //       searchTerm: bucketRequirements
        //     },
        //     {
        //       type: 'simple',
        //       fuzzy: false,
        //       searchTerm: `entity.${getPropertyTypeId(app, PROPERTY_TYPES.CAPACITY_AGE_UNKNOWN)}:[${totalChildren} TO *]`
        //     }
        //   ]
        constraints.push(childrenConstraint);
        };



    }

    if (daysAndTimes && daysAndTimes.size) {

      const daysAndTimesConstraints = [];

      daysAndTimes.entrySeq().forEach(([day, [start, end]]) => {

        if (start) {
          const propertyTypeId = getPropertyTypeId(app, DAY_PTS[day][0]);
          daysAndTimesConstraints.push({
            type: 'simple',
            fuzzy: false,
            searchTerm: `entity.${propertyTypeId}:[* TO ${formatTimeAsDateTime(start)}]`
          });
        }

        if (end) {
          const propertyTypeId = getPropertyTypeId(app, DAY_PTS[day][1]);
          daysAndTimesConstraints.push({
            type: 'simple',
            fuzzy: false,
            searchTerm: `entity.${propertyTypeId}:[${formatTimeAsDateTime(end)} TO *]`
          });
        }

        if (!start && !end) {
          const propertyTypeId = getPropertyTypeId(app, DAY_PTS[day][0]);
          daysAndTimesConstraints.push({
            type: 'simple',
            fuzzy: false,
            searchTerm: `_exists_:entity.${propertyTypeId}`
          });
        }
      });

      constraints.push({
        constraints: daysAndTimesConstraints,
        min: daysAndTimesConstraints.length
      });

    }

    const searchOptions = {
      start,
      entitySetIds: [entitySetId],
      maxHits,
      constraints,
      sort
    };

    const { hits, numHits } = yield call(SearchApi.executeSearch, searchOptions);

    const locationsEKIDs = hits.map(getEntityKeyId);
    const locationsByEKID = Map(hits.map((entity) => [getEntityKeyId(entity), fromJS(entity)]));
    response.data.hits = fromJS(locationsEKIDs);
    response.data.totalHits = numHits;
    response.data.providerLocations = locationsByEKID;

    const rrsById = yield call(SearchApi.searchEntityNeighborsWithFilter, entitySetId, {
      entityKeyIds: response.data.hits.toJS(),
      sourceEntitySetIds: [],
      destinationEntitySetIds: [RR_ENTITY_SET_ID]
    });

    response.data.rrsById = fromJS(rrsById);

    yield put(searchLocations.success(action.id, {
      newData: response.data
    }));
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
