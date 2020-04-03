// @flow
import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import { DataProcessingUtils } from 'lattice-fabricate';
import { List, Map, fromJS } from 'immutable';
import type { SequenceAction } from 'redux-reqseq';
import { Constants } from 'lattice';
import {
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';

import Logger from '../../../../../utils/Logger';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../../../utils/Errors';
import { isDefined } from '../../../../../utils/LangUtils';
import { isValidUuid } from '../../../../../utils/Utils';
import {
  GET_ADDRESS,
  SUBMIT_ADDRESS,
  UPDATE_ADDRESS,
  getAddress,
  submitAddress,
  updateAddress,
} from '../actions/AddressActions';
import {
  submitDataGraph,
  submitPartialReplace,
} from '../../../../../core/sagas/data/DataActions';
import {
  submitDataGraphWorker,
  submitPartialReplaceWorker,
} from '../../../../../core/sagas/data/DataSagas';

import { getESIDFromApp } from '../../../../../utils/AppUtils';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import { getFormDataFromEntity } from '../../../../../utils/DataUtils';
import * as FQN from '../../../../../edm/DataModelFqns';

const LOG = new Logger('BasicInformationSagas');
const { getPageSectionKey } = DataProcessingUtils;
const { OPENLATTICE_ID_FQN } = Constants;
const {
  LOCATED_AT_FQN,
  PEOPLE_FQN,
  LOCATION_FQN,
} = APP_TYPES_FQNS;

const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

function* getAddressWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isDefined(entityKeyId)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getAddress.request(action.id, entityKeyId));

    const app :Map = yield select((state) => state.get('app', Map()));
    const entitySetId :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const locationESID :UUID = getESIDFromApp(app, LOCATION_FQN);
    const locatedAtESID :UUID = getESIDFromApp(app, LOCATED_AT_FQN);

    const locationSearchParams = {
      entitySetId,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [locatedAtESID],
        destinationEntitySetIds: [locationESID],
        sourceEntitySetIds: [],
      }
    };

    const locationRequest = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(locationSearchParams)
    );

    if (locationRequest.error) throw locationRequest.error;
    const locationDataList = fromJS(locationRequest.data).get(entityKeyId, List());
    if (locationDataList.count() > 1) {
      LOG.warn('more than one location found in person', entityKeyId);
    }

    const locationData = locationDataList
      .getIn([0, 'neighborDetails'], Map());

    if (!locationData.isEmpty()) {

      const locationProperties = [
        FQN.LOCATION_ADDRESS_LINE_2_FQN,
        FQN.LOCATION_CITY_FQN,
        FQN.LOCATION_NAME_FQN,
        FQN.LOCATION_STATE_FQN,
        FQN.LOCATION_STREET_FQN,
        FQN.LOCATION_ZIP_FQN,
      ];

      const locationEKID = locationData.getIn([OPENLATTICE_ID_FQN, 0]);

      const locationFormData = getFormDataFromEntity(
        locationData,
        LOCATION_FQN,
        locationProperties,
        0
      );
      response.entityIndexToIdMap = Map().setIn([LOCATION_FQN, 0], locationEKID);
      response.formData = Map().set(getPageSectionKey(1, 1), locationFormData);
    }

    response.data = locationData;

    yield put(getAddress.success(action.id, response));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(getAddress.failure(action.id, error));
  }

  return response;
}

function* getAddressWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_ADDRESS, getAddressWorker);
}

function* submitAddressWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (value === null || value === undefined) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(submitAddress.request(action.id));
    const response = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    const newEntityKeyIdsByEntitySetId = fromJS(response.data).get('entityKeyIds');

    const selectedOrgEntitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const entitySetNamesByEntitySetId = selectedOrgEntitySetIds.flip();

    const newEntityKeyIdsByEntitySetName = newEntityKeyIdsByEntitySetId
      .mapKeys((entitySetId) => entitySetNamesByEntitySetId.get(entitySetId));

    const locationEKID = newEntityKeyIdsByEntitySetName.getIn([LOCATION_FQN, 0]);

    const entityIndexToIdMap = Map().setIn([LOCATION_FQN.toString(), 0], locationEKID);

    const { path, properties } = value;

    yield put(submitAddress.success(action.id, {
      entityIndexToIdMap,
      path,
      properties
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(submitAddress.failure(action.id, error));
  }
}

function* submitAddressWatcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_ADDRESS, submitAddressWorker);
}

function* updateAddressWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (value === null || value === undefined) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(updateAddress.request(action.id, value));
    const response = yield call(submitPartialReplaceWorker, submitPartialReplace(value));

    if (response.error) throw response.error;

    yield put(updateAddress.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(updateAddress.failure(action.id, error));
  }
}

function* updateAddressWatcher() :Generator<any, any, any> {
  yield takeEvery(UPDATE_ADDRESS, updateAddressWorker);
}

export {
  getAddressWatcher,
  getAddressWorker,
  submitAddressWatcher,
  submitAddressWorker,
  updateAddressWatcher,
  updateAddressWorker,
};
