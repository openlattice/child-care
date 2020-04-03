/*
 * @flow
 */

/* eslint-disable no-use-before-define */

import { call, put, takeEvery } from '@redux-saga/core/effects';
import { SearchApiActions, SearchApiSagas } from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  SEARCH_CONSUMERS,
  searchConsumers,
} from './SearchActionFactory';

const {
  searchEntitySetData,
} = SearchApiActions;

const {
  searchEntitySetDataWorker,
} = SearchApiSagas;

/*
 * searchConsumers sagas
 */

function* searchConsumersWatcher() :Generator<*, *, *> {

  yield takeEvery(SEARCH_CONSUMERS, searchConsumersWorker);
}

function* searchConsumersWorker(action :SequenceAction) :Generator<*, *, *> {

  try {
    yield put(searchConsumers.request(action.id, action.value));

    const response = yield call(
      searchEntitySetDataWorker,
      searchEntitySetData({
        entitySetId: action.value.entitySetId,
        searchOptions: {
          searchTerm: action.value.query,
          start: 0,
          maxHits: 10000
        },
      })
    );

    if (response.error) {
      yield put(searchConsumers.failure(action.id, response.error));
    }
    yield put(searchConsumers.success(action.id, response.data));
  }
  catch (error) {
    yield put(searchConsumers.failure(action.id, error));
  }
  finally {
    yield put(searchConsumers.finally(action.id));
  }
}

export {
  searchConsumersWatcher,
  searchConsumersWorker
};
