// @flow
import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import { List, Map, fromJS } from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import {
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import Logger from '../../../../../utils/Logger';
import * as FQN from '../../../../../edm/DataModelFqns';
import {
  submitDataGraph,
  submitPartialReplace,
} from '../../../../../core/sagas/data/DataActions';
import {
  submitDataGraphWorker,
  submitPartialReplaceWorker,
} from '../../../../../core/sagas/data/DataSagas';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import { getESIDFromApp } from '../../../../../utils/AppUtils';
import { getFormDataFromEntity } from '../../../../../utils/DataUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../../../utils/Errors';
import { isDefined } from '../../../../../utils/LangUtils';
import { isValidUuid } from '../../../../../utils/Utils';
import {
  GET_SCARS_MARKS_TATOOS,
  SUBMIT_SCARS_MARKS_TATOOS,
  UPDATE_SCARS_MARKS_TATOOS,
  getScarsMarksTattoos,
  submitScarsMarksTattoos,
  updateScarsMarksTattoos,
} from '../actions/ScarsMarksTattoosActions';

const LOG = new Logger('ScarsMarksTattoosSagas');
const { getPageSectionKey } = DataProcessingUtils;
const { OPENLATTICE_ID_FQN } = Constants;
const {
  OBSERVED_IN_FQN,
  PEOPLE_FQN,
  IDENTIFYING_CHARACTERISTICS_FQN
} = APP_TYPES_FQNS;

const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

function* getScarsMarksTattoosWorker(action :SequenceAction) :Generator<any, any, any> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isDefined(entityKeyId)) throw ERR_ACTION_VALUE_NOT_DEFINED;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getScarsMarksTattoos.request(action.id, entityKeyId));

    const app :Map = yield select((state) => state.get('app', Map()));
    const entitySetId :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const identifyingCharacteristicsESID :UUID = getESIDFromApp(app, IDENTIFYING_CHARACTERISTICS_FQN);
    const observedInESID :UUID = getESIDFromApp(app, OBSERVED_IN_FQN);

    const characteristicsParams = {
      entitySetId,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [observedInESID],
        destinationEntitySetIds: [],
        sourceEntitySetIds: [identifyingCharacteristicsESID],
      }
    };

    const characteristicsRequest = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(characteristicsParams)
    );

    if (characteristicsRequest.error) throw characteristicsRequest.error;
    const characteristicsDataList = fromJS(characteristicsRequest.data).get(entityKeyId, List());
    if (characteristicsDataList.count() > 1) {
      LOG.warn('more than one characteristics found in person', entityKeyId);
    }

    const characteristicsData = characteristicsDataList
      .getIn([0, 'neighborDetails'], Map());

    if (!characteristicsData.isEmpty()) {

      const marksProperties = [FQN.DESCRIPTION_FQN];

      const characteristicsEKID = characteristicsData.getIn([OPENLATTICE_ID_FQN, 0]);

      const characteristicsFormData = getFormDataFromEntity(
        characteristicsData,
        IDENTIFYING_CHARACTERISTICS_FQN,
        marksProperties,
        0
      );
      response.entityIndexToIdMap = Map().setIn([IDENTIFYING_CHARACTERISTICS_FQN, 0], characteristicsEKID);
      response.formData = Map().set(getPageSectionKey(1, 1), characteristicsFormData);
    }

    response.data = characteristicsData;

    yield put(getScarsMarksTattoos.success(action.id, response));
  }
  catch (error) {
    response.error = error;
    yield put(getScarsMarksTattoos.failure(action.id, error));
  }

  return response;
}

function* getScarsMarksTattoosWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_SCARS_MARKS_TATOOS, getScarsMarksTattoosWorker);
}

function* submitScarsMarksTattoosWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (value === null || value === undefined) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(submitScarsMarksTattoos.request(action.id));
    const response = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    const newEntityKeyIdsByEntitySetId = fromJS(response.data).get('entityKeyIds');

    const selectedOrgEntitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const entitySetNamesByEntitySetId = selectedOrgEntitySetIds.flip();

    const newEntityKeyIdsByEntitySetName = newEntityKeyIdsByEntitySetId
      .mapKeys((entitySetId) => entitySetNamesByEntitySetId.get(entitySetId));

    const marksEKID = newEntityKeyIdsByEntitySetName.getIn([IDENTIFYING_CHARACTERISTICS_FQN, 0]);

    const entityIndexToIdMap = Map().setIn([IDENTIFYING_CHARACTERISTICS_FQN.toString(), 0], marksEKID);

    const { path, properties } = value;

    yield put(submitScarsMarksTattoos.success(action.id, {
      entityIndexToIdMap,
      path,
      properties
    }));
  }
  catch (error) {
    yield put(submitScarsMarksTattoos.failure(action.id, error));
  }
}

function* submitScarsMarksTattoosWatcher() :Generator<any, any, any> {
  yield takeEvery(SUBMIT_SCARS_MARKS_TATOOS, submitScarsMarksTattoosWorker);
}

function* updateScarsMarksTattoosWorker(action :SequenceAction) :Generator<any, any, any> {
  try {
    const { value } = action;
    if (value === null || value === undefined) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(updateScarsMarksTattoos.request(action.id, value));
    const response = yield call(submitPartialReplaceWorker, submitPartialReplace(value));

    if (response.error) throw response.error;

    yield put(updateScarsMarksTattoos.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(updateScarsMarksTattoos.failure(action.id, error));
  }
}

function* updateScarsMarksTattoosWatcher() :Generator<any, any, any> {
  yield takeEvery(UPDATE_SCARS_MARKS_TATOOS, updateScarsMarksTattoosWorker);
}

export {
  getScarsMarksTattoosWatcher,
  getScarsMarksTattoosWorker,
  submitScarsMarksTattoosWatcher,
  submitScarsMarksTattoosWorker,
  updateScarsMarksTattoosWatcher,
  updateScarsMarksTattoosWorker,
};
