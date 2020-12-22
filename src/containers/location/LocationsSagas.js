// @flow

import axios from 'axios';
import isPlainObject from 'lodash/isPlainObject';
import qs from 'qs';
import {
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
  get,
  has,
  isImmutable
} from 'immutable';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import type { Saga } from '@redux-saga/core';
import type { WorkerResponse } from 'lattice-sagas';
import type { RequestSequence, SequenceAction } from 'redux-reqseq';

import {
  GEOCODE_PLACE,
  GET_GEO_OPTIONS,
  LOAD_CURRENT_POSITION,
  SEARCH_LOCATIONS,
  SEARCH_REFERRAL_AGENCIES,
  geocodePlace,
  getGeoOptions,
  loadCurrentPosition,
  searchLocations,
  searchReferralAgencies
} from './LocationsActions';

import Logger from '../../utils/Logger';
import { getPropertyTypeId, getProvidersESID, getTextFnFromState } from '../../utils/AppUtils';
import { CLIENTS_SERVED, CLOSED, DAY_PTS } from '../../utils/DataConstants';
import { formatTimeAsDateTime, getEntityKeyId } from '../../utils/DataUtils';
import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';
import {
  HOSPITALS_ENTITY_SET_ID,
  PROPERTY_TYPES,
  RR_ENTITY_SET_ID
} from '../../utils/constants/DataModelConstants';
import { HAS_LOCAL_STORAGE_GEO_PERMISSIONS, PROVIDERS, STATE } from '../../utils/constants/StateConstants';
import { LABELS } from '../../utils/constants/labels';
import { loadApp } from '../app/AppActions';
import { refreshAuthTokenIfNecessary } from '../app/AppSagas';

const { searchEntitySetData, searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntitySetDataWorker, searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

declare var __MAPBOX_TOKEN__;

const AGE_GROUP_BY_FQN = {
  [PROPERTY_TYPES.CAPACITY_UNDER_2]: CLIENTS_SERVED.INFANTS,
  [PROPERTY_TYPES.CAPACITY_2_TO_5]: CLIENTS_SERVED.TODDLERS,
  [PROPERTY_TYPES.CAPACITY_OVER_5]: CLIENTS_SERVED.CHILDREN
};

const {
  ACTIVE_ONLY,
  CHILDREN,
  DAYS,
  LAT,
  LON,
  RADIUS,
  SEARCH_INPUTS,
  SELECTED_OPTION,
  TYPE_OF_CARE,
  ZIP,
} = PROVIDERS;

const PAGE_SIZE = 20;

const LOG = new Logger('LocationsSagas');

const GEOCODING_API = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

const CA_BOUNDARY_BOX = '-124.409591,32.534156,-114.131211,42.009518';
const regionIsCalifornia = (suggestion) => suggestion.context
  .filter((item) => item.id.split('.').shift() === 'region' && item.text === 'California').length > 0;

const hasLocation = (entity :Map) => (has(entity, PROPERTY_TYPES.LOCATION));

function* getGeoOptionsWorker(action :SequenceAction) :Saga<*> {
  try {
    yield put(getGeoOptions.request(action.id));

    yield call(refreshAuthTokenIfNecessary);

    const { address, currentPosition } = action.value;

    const params :Object = {
      access_token: __MAPBOX_TOKEN__,
      autocomplete: true,
    };

    if (currentPosition && currentPosition.coords) {
      const { latitude, longitude } = currentPosition.coords;
      params.proximity = `${longitude},${latitude}`;
    }

    const queryString = qs.stringify(params);

    const { data: suggestions } = yield call(axios, {
      method: 'get',
      url: `${GEOCODING_API}/${window.encodeURI(address)}.json?bbox=${CA_BOUNDARY_BOX}&${queryString}`,
    });

    const formattedSuggestions = suggestions.features
      .filter(regionIsCalifornia)
      .map((sugg) => {
        const { place_name: placeName, geometry } = sugg;
        const { coordinates } = geometry;
        const [lon, lat] = coordinates;
        return {
          ...sugg,
          label: placeName,
          value: placeName,
          lon,
          lat
        };
      });

    yield put(getGeoOptions.success(action.id, fromJS(formattedSuggestions)));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getGeoOptions.failure(action.id, error));
  }
  finally {
    yield put(getGeoOptions.finally(action.id));
  }
}

function* getGeoOptionsWatcher() :Saga<*> {
  yield takeEvery(GET_GEO_OPTIONS, getGeoOptionsWorker);
}

const tryReadStoredPermissions = () => {
  try {
    return localStorage.getItem(HAS_LOCAL_STORAGE_GEO_PERMISSIONS);
  }
  catch (error) {
    LOG.error('tryReadStoredPermissions', error);
    return '';
  }
};

const trySetStoredPermissions = (bool) => {
  try {
    /* eslint-disable-next-line */
    localStorage.setItem(HAS_LOCAL_STORAGE_GEO_PERMISSIONS, String(bool));
  }
  catch (error) {
    LOG.error('trySetStoredPermissions', error);
  }
};

function* loadCurrentPositionWorker(action :SequenceAction) :Saga<*> {
  /* check location perms */
  if (action.value.shouldSearchIfLocationPerms && tryReadStoredPermissions() !== 'true') {
    return;
  }

  try {
    yield put(loadCurrentPosition.request(action.id));

    const getText = yield select(getTextFnFromState);

    const getUserLocation = () => new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          trySetStoredPermissions(true);
          return resolve(location);
        },
        (error) => {
          trySetStoredPermissions(true);
          return reject(error);
        }
      );
    });

    const location = yield call(getUserLocation);

    yield put(loadCurrentPosition.success(action.id, location));

    const { latitude, longitude } = location.coords;
    yield put(searchLocations({
      searchInputs: Map({
        selectedOption: {
          label: getText(LABELS.CURRENT_LOCATION),
          value: `${latitude},${longitude}`,
          lat: latitude,
          lon: longitude
        }
      }),
      start: 0,
      maxHits: PAGE_SIZE
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(loadCurrentPosition.failure(action.id, error));
  }
  finally {
    yield put(loadCurrentPosition.finally(action.id));
  }
}

function* loadCurrentPositionWatcher() :Saga<*> {
  yield takeEvery(LOAD_CURRENT_POSITION, loadCurrentPositionWorker);
}

function* geocodePlaceWorker(action :SequenceAction) :Saga<*> {
  try {
    yield put(geocodePlace.request(action.id));

    const data = action.value;

    const { geometry, label } = data;
    const { coordinates } = geometry;
    const [lon, lat] = coordinates;

    const selectedOption = {
      ...data,
      label,
      value: `${lat},${lon}`,
      lat,
      lon
    };

    yield put(geocodePlace.success(action.id, selectedOption));

    yield put(searchLocations({
      searchInputs: Map({ selectedOption }),
      start: 0,
      maxHits: PAGE_SIZE
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(geocodePlace.failure(action.id, error));
  }
  finally {
    yield put(geocodePlace.finally(action.id));
  }
}

export function* geocodePlaceWatcher() :Saga<*> {
  yield takeEvery(GEOCODE_PLACE, geocodePlaceWorker);
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

  try {

    yield call(refreshAuthTokenIfNecessary);

    const { value } = action;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;
    const { searchInputs, start = 0, maxHits = 20 } = value;

    const locationState = yield select((state) => state.get(STATE.LOCATIONS));
    const getValue = (field) => searchInputs.get(field, locationState.get(field));

    let latLonObj = searchInputs.get(SELECTED_OPTION);
    if (isEmpty(latLonObj)) latLonObj = searchInputs.getIn([ZIP, 1]);
    if (isEmpty(latLonObj)) latLonObj = locationState.getIn([SEARCH_INPUTS, SELECTED_OPTION]);
    if (!isImmutable(latLonObj)) latLonObj = fromJS(latLonObj);

    const radius = getValue(RADIUS);
    const typeOfCare = getValue(TYPE_OF_CARE);
    const children = getValue(CHILDREN);
    const daysAndTimes = getValue(DAYS);
    const activeOnly = getValue(ACTIVE_ONLY);

    yield put(searchLocations.request(action.id, {
      page: start,
      searchInputs: searchInputs.set(SELECTED_OPTION, latLonObj)
    }));

    const latitude :string = get(latLonObj, LAT);
    const longitude :string = get(latLonObj, LON);

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
        constraints: typeOfCare.map((v) => ({
          type: 'simple',
          searchTerm: `entity.${propertyTypeId}:"${v}"`,
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
        constraints.push(childrenConstraint);
      }
    }

    if (daysAndTimes && daysAndTimes.size) {

      const daysAndTimesConstraints = [];

      daysAndTimes.entrySeq().forEach(([day, [startDate, endDate]]) => {

        if (startDate) {
          const propertyTypeId = getPropertyTypeId(app, DAY_PTS[day][0]);
          daysAndTimesConstraints.push({
            type: 'simple',
            fuzzy: false,
            searchTerm: `entity.${propertyTypeId}:[* TO ${formatTimeAsDateTime(startDate)}]`
          });
        }

        if (endDate) {
          const propertyTypeId = getPropertyTypeId(app, DAY_PTS[day][1]);
          daysAndTimesConstraints.push({
            type: 'simple',
            fuzzy: false,
            searchTerm: `entity.${propertyTypeId}:[${formatTimeAsDateTime(endDate)} TO *]`
          });
        }

        if (!startDate && !endDate) {
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

    const searchConstraints = {
      start: start * PAGE_SIZE,
      entitySetIds: [entitySetId],
      maxHits,
      constraints,
      sort
    };

    const response :WorkerResponse = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData(searchConstraints),
    );

    if (response.error) throw response.error;
    const { hits, numHits: totalHits } = response.data;

    const filteredHits = fromJS(hits).filter(hasLocation);

    const locationsEKIDs = filteredHits.map(getEntityKeyId);
    const providerLocations = Map().withMutations((mutableMap) => {
      filteredHits.forEach((entity) => {
        const EKID = getEntityKeyId(entity);
        mutableMap.set(EKID, entity);
      });
    });

    let neighborsById = {};

    if (!locationsEKIDs.isEmpty()) {
      const filter = {
        entityKeyIds: locationsEKIDs.toJS(),
        sourceEntitySetIds: [],
        destinationEntitySetIds: [RR_ENTITY_SET_ID, HOSPITALS_ENTITY_SET_ID]
      };
      const neighborSearchResponse :WorkerResponse = yield call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter({ entitySetId, filter }),
      );
      if (neighborSearchResponse.error) throw neighborSearchResponse.error;
      neighborsById = neighborSearchResponse.data;
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

    yield put(searchLocations.success(action.id, {
      hits: locationsEKIDs,
      hospitalsById,
      providerLocations,
      rrsById,
      totalHits
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(searchLocations.failure(action.id));
  }
  finally {
    yield put(searchLocations.finally(action.id));
  }
}

function* searchLocationsWatcher() :Generator<any, any, any> {
  yield takeEvery(SEARCH_LOCATIONS, searchLocationsWorker);
}

function* searchReferralAgenciesWorker(action :SequenceAction) :Generator<any, any, any> {

  try {
    yield call(refreshAuthTokenIfNecessary);

    const { value } = action;
    const { searchInputs } = value;
    if (!isPlainObject(value)) throw ERR_ACTION_VALUE_TYPE;

    // check for postcode
    let zone = '';
    // from context
    searchInputs?.context.forEach((detail) => {
      if (detail.id.startsWith('postcode')) {
        zone = detail.text;
      }
    });
    // from text if a zip was searched
    if (searchInputs.place_type.includes('postcode')) {
      zone = searchInputs.text;
    }

    const zoneSearched = zone.length > 0;

    yield put(searchReferralAgencies.request(action.id, {
      searchInputs: fromJS(searchInputs)
    }));

    const latitude :string = searchInputs.lat;
    const longitude :string = searchInputs.lon;

    const entitySetId = RR_ENTITY_SET_ID;
    let app :Map = yield select((state) => state.get('app', Map()));
    let providerEntitySetId = getProvidersESID(app);

    if (!providerEntitySetId) {
      const loadAppRequest = loadApp();
      yield put(loadAppRequest);
      yield takeReqSeqSuccessFailure(loadApp, loadAppRequest);
      app = yield select((state) => state.get('app', Map()));
      providerEntitySetId = getProvidersESID(app);
    }

    const locationPropertyTypeId = getPropertyTypeId(app, PROPERTY_TYPES.LOCATION);
    const zipServedPropertyTypeId = getPropertyTypeId(app, PROPERTY_TYPES.ZIP_SERVED_STRING);
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
        radius: 100,
        unit: 'miles'
      }, {
        type: 'simple',
        fuzzy: false,
        searchTerm: `_exists_:entity.${locationPropertyTypeId}`
      }],
      min: 2
    };

    const zipConstraint = {
      constraints: [{
        type: 'simple',
        searchTerm: `entity.${zipServedPropertyTypeId}:"${zone}"`,
      }]
    };

    const searchConstraints = {
      start: 0,
      entitySetIds: [entitySetId],
      maxHits: 5,
      constraints: [],
      sort
    };

    let filteredHits = List();

    if (zoneSearched) {
      searchConstraints.constraints = [zipConstraint];
      const response :WorkerResponse = yield call(
        searchEntitySetDataWorker,
        searchEntitySetData(searchConstraints),
      );
      if (response.error) throw response.error;
      const { hits } = response.data;
      const filteredZipHits = fromJS(hits).filter(hasLocation);

      if (!filteredZipHits.isEmpty()) {
        filteredHits = filteredZipHits;
      }
    }
    if (filteredHits.isEmpty()) {
      searchConstraints.constraints = [locationConstraint];
      const response :WorkerResponse = yield call(
        searchEntitySetDataWorker,
        searchEntitySetData(searchConstraints),
      );
      if (response.error) throw response.error;
      const { hits } = response.data;
      const filteredLocationHits = fromJS(hits).filter(hasLocation);
      filteredHits = filteredLocationHits;
    }

    const referralAgencyLocations = Map().withMutations((mutableMap) => {
      filteredHits.forEach((entity) => {
        const EKID = getEntityKeyId(entity);
        mutableMap.set(EKID, entity);
      });
    });

    yield put(searchReferralAgencies.success(action.id, { referralAgencyLocations, zoneSearched }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(searchReferralAgencies.failure(action.id));
  }
  finally {
    yield put(searchReferralAgencies.finally(action.id));
  }
}

function* searchReferralAgenciesWatcher() :Generator<any, any, any> {
  yield takeEvery(SEARCH_REFERRAL_AGENCIES, searchReferralAgenciesWorker);
}

export {
  getGeoOptionsWatcher,
  getGeoOptionsWorker,
  searchLocationsWatcher,
  searchReferralAgenciesWatcher,
  searchLocationsWorker,
  loadCurrentPositionWatcher,
};
