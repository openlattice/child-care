/*
 * @flow
 */

import {
  all,
  call,
  put,
  takeLatest,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
} from 'immutable';
import {
  DataApiActions,
  DataApiSagas,
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  GET_LB_PROVIDERS,
  getLBProviders,
} from './LongBeachProviderActions';

import Logger from '../../utils/Logger';

const { getEntitySetData } = DataApiActions;
const { getEntitySetDataWorker } = DataApiSagas;
const LOG = new Logger('LongBeachProviderSagas');

function* getLBProvidersWorker(action :SequenceAction) :Generator<any, any, any> {
  const response :Object = {};

  try {
    yield put(getLBProviders.request(action.id));

    const providerESIDs = [
      '15577bac-3502-4ec6-a182-4a04c12302f9',
      '1c7d4f2f-7b15-4417-84eb-fd3996ede062',
      '1e803ab5-f61c-45f5-b7be-3ad4aed9f151',
      '3fd50a6d-7568-42bb-a08b-bc952ca71845',
      '722a64d8-e4b7-4a2e-864c-4d2d8ee07cb4',
      'b58efd37-7310-47d0-853c-44df4fdee301',
      'b6413d62-d5fa-4833-a72d-9f737566d519',
      'df986a9e-5431-437b-89a9-25d98d7e32cb',
      'f7dec926-cd09-4dce-83dc-a19e9dd9ef2e',
    ];

    const providersRequests = providerESIDs
      .map((entitySetId) => call(getEntitySetDataWorker, getEntitySetData({ entitySetId })));

    const providersResponses = yield all(providersRequests);

    const neighborsError = providersResponses.reduce((acc, providerResponse) => {
      if (providerResponse.error) {
        acc.push(providerResponse.error);
      }
      return acc;
    }, []);
    if (neighborsError.length) throw neighborsError;

    const providers = fromJS(providersResponses)
      .map((entityData) => entityData.get('data', List()).first() || Map());

    response.providers = providers;

    yield put(getLBProviders.success(action.id, response));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(getLBProviders.failure(action.id));
  }

  return response;
}

function* getLBProvidersWatcher() :Generator<any, any, any> {
  yield takeLatest(GET_LB_PROVIDERS, getLBProvidersWorker);
}

export {
  getLBProvidersWorker,
  getLBProvidersWatcher,
};
