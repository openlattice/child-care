// @flow

import axios from 'axios';
import isFunction from 'lodash/isFunction';
import isPlainObject from 'lodash/isPlainObject';
import {
  all,
  call,
  put,
  select,
  take,
  takeEvery
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
  isImmutable
} from 'immutable';
import { SearchApi } from 'lattice';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_GEO_OPTIONS,
  SEARCH_LOCATIONS,
  LOAD_CURRENT_POSITION,
  loadCurrentPosition,
  getGeoOptions,
  searchLocations,
} from './providers/LocationsActions';
import { STAY_AWAY_STORE_PATH } from './providers/constants';

import Logger from '../../utils/Logger';
import { getPropertyTypeId, getProvidersESID } from '../../utils/AppUtils';
import { CLIENTS_SERVED, CLOSED, DAY_PTS } from '../../utils/DataConstants';
import { formatTimeAsDateTime, getEntityKeyId } from '../../utils/DataUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import {
  HOSPITALS_ENTITY_SET_ID,
  PROPERTY_TYPES,
  RR_ENTITY_SET_ID,
} from '../../utils/constants/DataModelConstants';
import { PROVIDERS, HAS_LOCAL_STORAGE_GEO_PERMISSIONS } from '../../utils/constants/StateConstants';
import { loadApp } from '../app/AppActions';
import { refreshAuthTokenIfNecessary } from '../app/AppSagas';

import { getRenderTextFn } from '../../utils/AppUtils';
import { LABELS } from '../../utils/constants/Labels';

declare var gtag :?Function;

const AGE_GROUP_BY_FQN = {
  [PROPERTY_TYPES.CAPACITY_UNDER_2]: CLIENTS_SERVED.INFANTS,
  [PROPERTY_TYPES.CAPACITY_2_TO_5]: CLIENTS_SERVED.TODDLERS,
  [PROPERTY_TYPES.CAPACITY_OVER_5]: CLIENTS_SERVED.CHILDREN
};

const PAGE_SIZE = 20;

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

    if (isFunction(gtag)) {
      gtag('event', 'Geocode Address', {
        event_category: 'Search',
        event_label: address,
      });
    }

    const { data: suggestions } = yield call(axios, {
      method: 'post',
      url: `${GEOCODING_API}/autocomplete`,
      headers,
      data: {
        input: address,
        componentFilters: DEFAULT_AUTOCOMPLETE_COMPONENTS,
        radius: 10000,
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

function* loadCurrentPositionWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    yield put(loadCurrentPosition.request(action.id));

    const renderText = yield select(getRenderTextFn);

    const getUserLocation = () => new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        location => {
          localStorage.setItem(HAS_LOCAL_STORAGE_GEO_PERMISSIONS, 'true');
          return resolve(location)
        },
        error => {
          localStorage.setItem(HAS_LOCAL_STORAGE_GEO_PERMISSIONS, 'false');
          return reject(error)
        }
      )
    })

    const location = yield call(getUserLocation)

    yield put(loadCurrentPosition.success(action.id, location));

    const { latitude, longitude } = location.coords;
    yield put(searchLocations({
        searchInputs: Map({
          selectedOption: {
            label: renderText(LABELS.CURRENT_LOCATION),
            value: `${latitude},${longitude}`,
            lat: latitude,
            lon: longitude
          }
        }),
        start: 0,
        maxHits: PAGE_SIZE
      })
    )
  }
  catch (error) {
    console.error(error)
    yield put(loadCurrentPosition.failure(action.id, error));
  }
  finally {
    yield put(loadCurrentPosition.finally(action.id));
  }
}

function* loadCurrentPositionWatcher() :Generator<*, *, *> {
  yield takeEvery(LOAD_CURRENT_POSITION, loadCurrentPositionWorker);
}

const isEmpty = (map) => {
  if (!map) return true;
  return isImmutable(map) ? map.size === 0 : Object.keys(map).length === 0;
};

function takeReqSeqSuccessFailure(reqseq :RequestSequence, seqAction :SequenceAction) {
  return take(
    (anAction :Object) => (anAction.type === reqseq.SUCCESS && anAction.id === seqAction.id)
        || (anAction.type === reqseq.FAILURE && anAction.id === seqAction.id)
  );
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

    yield put(searchLocations.request(action.id, {
      page: start,
      searchInputs: searchInputs.set('selectedOption', latLonObj)
    }));

    const latitude :string = isImmutable(latLonObj) ? latLonObj.get('lat') : latLonObj['lat'];
    const longitude :string = isImmutable(latLonObj) ? latLonObj.get('lon') : latLonObj['lon'];

    if (isFunction(gtag)) {
      gtag('event', 'Execute Search', {
        event_category: 'Search',
        event_label: JSON.stringify({
          activeOnly,
          children,
          daysAndTimes,
          radius,
          typeOfCare,
        }),
      });
    }

    let app :Map = yield select((state) => state.get('app', Map()));
    let entitySetId = getProvidersESID(app);

    if (!entitySetId) {
      const loadAppRequest = loadApp();
      yield put(loadAppRequest);
      yield takeReqSeqSuccessFailure(loadApp, loadAppRequest);

      app = yield select((state) => state.get('app', Map()));
      entitySetId = getProvidersESID(app);
    }

    const locationPropertyTypeId = getPropertyTypeId(app, PROPERTY_TYPES.LOCATION);

    const sort = {
      type: 'geoDistance',
      descending: false,
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
      start: start * PAGE_SIZE,
      entitySetIds: [entitySetId],
      maxHits,
      constraints,
      sort
    };

    const { hits, numHits } = yield call(SearchApi.executeSearch, searchOptions);

    const filteredHits = fromJS(hits).filter(e => e.get(PROPERTY_TYPES.LOCATION, List()).size).toJS();

    const locationsEKIDs = filteredHits.map(getEntityKeyId);
    const locationsByEKID = Map(filteredHits.map((entity) => [getEntityKeyId(entity), fromJS(entity)]));
    response.data.hits = fromJS(locationsEKIDs);
    response.data.totalHits = numHits;
    response.data.providerLocations = locationsByEKID;

    let neighborsById = {};

    if (locationsEKIDs.length) {
      neighborsById = yield call(SearchApi.searchEntityNeighborsWithFilter, entitySetId, {
        entityKeyIds: response.data.hits.toJS(),
        sourceEntitySetIds: [],
        destinationEntitySetIds: [RR_ENTITY_SET_ID, HOSPITALS_ENTITY_SET_ID]
      });
    }

    let rrsById = Map();
    let hospitalsById = Map();

    fromJS(neighborsById).entrySeq().forEach(([entityKeyId, neighborList]) => {
      neighborList.forEach((neighbor) => {
        const neighborEntitySetId = neighbor.getIn(['neighborEntitySet', 'id']);
        if (neighborEntitySetId === RR_ENTITY_SET_ID) {
          rrsById = rrsById.set(entityKeyId, rrsById.get(entityKeyId, List()).push(neighbor));
        }
        if (neighborEntitySetId === HOSPITALS_ENTITY_SET_ID) {
          hospitalsById = hospitalsById.set(entityKeyId, neighbor);
        }
      });
    });

    response.data.rrsById = rrsById;
    response.data.hospitalsById = hospitalsById;

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
  searchLocationsWatcher,
  searchLocationsWorker,
  loadCurrentPositionWatcher,
};
