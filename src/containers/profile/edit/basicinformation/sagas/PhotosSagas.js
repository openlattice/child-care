// @flow
import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
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
  GET_PHOTOS,
  SUBMIT_PHOTOS,
  UPDATE_PHOTO,
  getPhotos,
  submitPhotos,
  updatePhoto,
} from '../actions/PhotosActions';
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

const LOG = new Logger('BasicInformationSagas');
const { OPENLATTICE_ID_FQN } = Constants;
const {
  IMAGE_FQN,
  IS_PICTURE_OF_FQN,
  PEOPLE_FQN,
} = APP_TYPES_FQNS;

const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

function* getPhotosWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getPhotos.request(action.id, entityKeyId));

    const app :Map = yield select((state) => state.get('app', Map()));
    const entitySetId :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const imageESID :UUID = getESIDFromApp(app, IMAGE_FQN);
    const isPictureOfESID :UUID = getESIDFromApp(app, IS_PICTURE_OF_FQN);

    const imageSearchParams = {
      entitySetId,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [isPictureOfESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [imageESID],
      }
    };

    const imageRequest = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(imageSearchParams)
    );

    if (imageRequest.error) throw imageRequest.error;
    const imageDataList = fromJS(imageRequest.data).get(entityKeyId, List());
    if (imageDataList.count() > 1) {
      LOG.warn('more than one image found in person', entityKeyId);
    }

    const imageData = imageDataList
      .getIn([0, 'neighborDetails'], Map());

    if (!imageData.isEmpty()) {
      const imageEKID = imageData.getIn([OPENLATTICE_ID_FQN, 0]);
      response.entityIndexToIdMap = Map().setIn([IMAGE_FQN.toString(), 0], imageEKID);
    }

    response.data = imageData;

    yield put(getPhotos.success(action.id, response));
  }
  catch (error) {
    response.error = error;
    LOG.error(action.type, error);
    yield put(getPhotos.failure(action.id, error));
  }

  return response;
}

function* getPhotosWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_PHOTOS, getPhotosWorker);
}

function* submitPhotosWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (value === null || value === undefined) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(submitPhotos.request(action.id));
    const response = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    const newEntityKeyIdsByEntitySetId = fromJS(response.data).get('entityKeyIds');

    const selectedOrgEntitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const entitySetNamesByEntitySetId = selectedOrgEntitySetIds.flip();

    const newEntityKeyIdsByEntitySetName = newEntityKeyIdsByEntitySetId
      .mapKeys((entitySetId) => entitySetNamesByEntitySetId.get(entitySetId));

    const imageEKID = newEntityKeyIdsByEntitySetName.getIn([IMAGE_FQN, 0]);

    const entityIndexToIdMap = Map().setIn([IMAGE_FQN.toString(), 0], imageEKID);

    const { path, properties } = value;

    yield put(submitPhotos.success(action.id, {
      entityIndexToIdMap,
      path,
      properties
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(submitPhotos.failure(action.id, error));
  }
}

function* submitPhotosWatcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_PHOTOS, submitPhotosWorker);
}

function* updatePhotoWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(updatePhoto.request(action.id, value));
    const response = yield call(submitPartialReplaceWorker, submitPartialReplace(value));

    if (response.error) throw response.error;

    yield put(updatePhoto.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(updatePhoto.failure(action.id, error));
  }
}

function* updatePhotoWatcher() :Generator<any, any, any> {
  yield takeEvery(UPDATE_PHOTO, updatePhotoWorker);
}

export {
  getPhotosWatcher,
  getPhotosWorker,
  submitPhotosWatcher,
  submitPhotosWorker,
  updatePhotoWatcher,
  updatePhotoWorker,
};
