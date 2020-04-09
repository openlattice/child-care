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
import { SearchApi } from 'lattice';
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
  SEARCH_LOCATIONS,
  getGeoOptions,
  getLBLocationsNeighbors,
  getLBStayAwayPeople,
  searchLocations,
} from './providers/LocationsActions';

import Logger from '../../utils/Logger';
import * as FQN from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';

import { refreshAuthTokenIfNecessary } from '../app/AppSagas';
import { getPropertyTypeId, getESIDsFromApp, getHospitalsESID, getProvidersESID } from '../../utils/AppUtils';
import { getEKIDsFromEntryValues, mapFirstEntityDataFromNeighbors, formatTimeAsDateTime } from '../../utils/DataUtils';
import { DAYS_OF_WEEK, CLOSED } from '../../utils/DataConstants';
import { PROPERTY_TYPES } from '../../utils/constants/DataModelConstants';
import { PROVIDERS } from '../../utils/constants/StateConstants';
import { ERR_ACTION_VALUE_TYPE } from '../../utils/Errors';

const { executeSearch, searchEntityNeighborsWithFilter } = SearchApiActions;
const { executeSearchWorker, searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const {
  FILED_FOR_FQN,
  STAY_AWAY_LOCATION_FQN,
  SERVICES_OF_PROCESS_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('LocationsSagas');

const GEOCODER_URL_PREFIX = 'https://osm.openlattice.com/nominatim/search/';
const GEOCODER_URL_SUFFIX = '?format=json';

const DAY_PTS = {
  [DAYS_OF_WEEK.SUNDAY]: [PROPERTY_TYPES.SUNDAY_START, PROPERTY_TYPES.SUNDAY_END],
  [DAYS_OF_WEEK.MONDAY]: [PROPERTY_TYPES.MONDAY_START, PROPERTY_TYPES.MONDAY_END],
  [DAYS_OF_WEEK.TUESDAY]: [PROPERTY_TYPES.TUESDAY_START, PROPERTY_TYPES.TUESDAY_END],
  [DAYS_OF_WEEK.WEDNESDAY]: [PROPERTY_TYPES.WEDNESDAY_START, PROPERTY_TYPES.WEDNESDAY_END],
  [DAYS_OF_WEEK.THURSDAY]: [PROPERTY_TYPES.THURSDAY_START, PROPERTY_TYPES.THURSDAY_END],
  [DAYS_OF_WEEK.FRIDAY]: [PROPERTY_TYPES.FRIDAY_START, PROPERTY_TYPES.FRIDAY_END],
  [DAYS_OF_WEEK.SATURDAY]: [PROPERTY_TYPES.SATURDAY_START, PROPERTY_TYPES.SATURDAY_END]
};

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

    const radius = getValue(PROVIDERS.RADIUS);
    const typeOfCare = getValue(PROVIDERS.TYPE_OF_CARE);
    const children = getValue(PROVIDERS.CHILDREN);
    const daysAndTimes = getValue(PROVIDERS.DAYS);

    yield put(searchLocations.request(action.id, searchInputs.set('selectedOption', latLonObj)));

    const latitude :string = isImmutable(latLonObj) ? latLonObj.get('lat') : latLonObj['lat'];
    const longitude :string = isImmutable(latLonObj) ? latLonObj.get('lon') : latLonObj['lon'];

    const app :Map = yield select((state) => state.get('app', Map()));
    const entitySetId = getProvidersESID(app);

    const locationConstraint = {
      constraints: [{
        type: 'geoDistance',
        latitude,
        longitude,
        propertyTypeId: getPropertyTypeId(app, PROPERTY_TYPES.LOCATION),
        radius,
        unit: 'miles'
      }]
    }

    const isNotClosedConstraint = {
      constraints: [{
        type: 'simple',
        fuzzy: 'false',
        searchTerm: `NOT(entity.${getPropertyTypeId(app, PROPERTY_TYPES.STATUS)}:"${CLOSED}")`
      }]
    }

    const constraints = [locationConstraint, isNotClosedConstraint];

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

      const childrenConstraint = {
        constraints: children.entrySeq().map(([fqn, number]) => ({
          type: 'simple',
          fuzzy: false,
          searchTerm: `entity.${getPropertyTypeId(app, fqn)}:[${number} TO *]`
        })).toJS(),
        min: children.size
      };

      constraints.push(childrenConstraint);
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
      constraints
    };

    const hospitalsEntitySetId = getHospitalsESID(app);

    const [data, hospitals] = yield all([
      call(SearchApi.executeSearch, searchOptions),
      call(SearchApi.executeSearch, {
        start: 0,
        maxHits: 10000,
        entitySetIds: [hospitalsEntitySetId],
        constraints: [{
          constraints: [{
            type: 'geoDistance',
            latitude,
            longitude,
            propertyTypeId: getPropertyTypeId(app, PROPERTY_TYPES.LOCATION),
            radius: radius * 2,
            unit: 'miles'
          }]
        }]
      })
    ]);

    const { hits, numHits } = data;
    const locationsEKIDs = hits.map((location) => getIn(location, [FQN.OPENLATTICE_ID_FQN, 0]));
    const locationsByEKID = Map(hits.map((entity) => [getIn(entity, [FQN.OPENLATTICE_ID_FQN, 0]), fromJS(entity)]));
    response.data.hits = fromJS(locationsEKIDs);
    response.data.totalHits = numHits;
    response.data.providerLocations = locationsByEKID;

    yield put(searchLocations.success(action.id, {
      newData: response.data,
      hospitals
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
