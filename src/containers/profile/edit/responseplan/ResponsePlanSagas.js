// @flow
import {
  call,
  put,
  select,
  takeEvery,
  takeLatest,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  fromJS,
} from 'immutable';
import { Constants } from 'lattice';
import {
  SearchApiActions,
  SearchApiSagas
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  DELETE_INTERACTION_STRATEGIES,
  GET_RESPONSE_PLAN,
  SUBMIT_RESPONSE_PLAN,
  UPDATE_RESPONSE_PLAN,
  deleteInteractionStrategies,
  getResponsePlan,
  submitResponsePlan,
  updateResponsePlan,
} from './ResponsePlanActions';
import { constructEntityIndexToIdMap, constructResponsePlanFormData } from './ResponsePlanUtils';

import Logger from '../../../../utils/Logger';
import {
  deleteBulkEntities,
  submitDataGraph,
  submitPartialReplace,
} from '../../../../core/sagas/data/DataActions';
import {
  deleteBulkEntitiesWorker,
  submitDataGraphWorker,
  submitPartialReplaceWorker,
} from '../../../../core/sagas/data/DataSagas';
import { INDEX_FQN, TECHNIQUES_FQN } from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { getESIDFromApp } from '../../../../utils/AppUtils';
import { removeEntitiesFromEntityIndexToIdMap } from '../../../../utils/DataUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_ACTION_VALUE_TYPE } from '../../../../utils/Errors';
import { isDefined } from '../../../../utils/LangUtils';
import { isValidUuid } from '../../../../utils/Utils';

const { OPENLATTICE_ID_FQN } = Constants;
const { searchEntityNeighborsWithFilter } = SearchApiActions;
const { searchEntityNeighborsWithFilterWorker } = SearchApiSagas;

const {
  PART_OF_FQN,
  INTERACTION_STRATEGY_FQN,
  PEOPLE_FQN,
  RESPONSE_PLAN_FQN,
  SUBJECT_OF_FQN,
} = APP_TYPES_FQNS;

const LOG = new Logger('ProfileSagas');

export function* submitResponsePlanWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(submitResponsePlan.request(action.id));
    const response = yield call(submitDataGraphWorker, submitDataGraph(value));
    if (response.error) throw response.error;

    const newEntityKeyIdsByEntitySetId = fromJS(response.data).get('entityKeyIds');

    const selectedOrgEntitySetIds = yield select((state) => state.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
    const entitySetNamesByEntitySetId = selectedOrgEntitySetIds.flip();

    const newEntityKeyIdsByEntitySetName = newEntityKeyIdsByEntitySetId
      .mapKeys((entitySetId) => entitySetNamesByEntitySetId.get(entitySetId));

    const responsePlanEKID = newEntityKeyIdsByEntitySetName.getIn([RESPONSE_PLAN_FQN, 0]);
    const interactionStrategyEKIDs = newEntityKeyIdsByEntitySetName.get(INTERACTION_STRATEGY_FQN);

    const newResponsePlanEAKIDMap = constructEntityIndexToIdMap(responsePlanEKID, interactionStrategyEKIDs);
    const entityIndexToIdMap = yield select((state) => state.getIn(['profile', 'responsePlan', 'entityIndexToIdMap']));
    const newEntityIndexToIdMap = entityIndexToIdMap.mergeDeep(newResponsePlanEAKIDMap);

    const { path, properties } = value;

    yield put(submitResponsePlan.success(action.id, {
      entityIndexToIdMap: newEntityIndexToIdMap,
      path,
      properties
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(submitResponsePlan.failure(action.id, error));
  }
}

export function* submitResponsePlanWatcher() :Generator<*, *, *> {
  yield takeEvery(SUBMIT_RESPONSE_PLAN, submitResponsePlanWorker);
}

export function* getResponsePlanWorker(action :SequenceAction) :Generator<*, *, *> {
  const response = {};
  try {
    const { value: entityKeyId } = action;
    if (!isValidUuid(entityKeyId)) throw ERR_ACTION_VALUE_TYPE;

    yield put(getResponsePlan.request(action.id));

    const app :Map = yield select((state) => state.get('app', Map()));
    const peopleESID :UUID = getESIDFromApp(app, PEOPLE_FQN);
    const subjectOfESID :UUID = getESIDFromApp(app, SUBJECT_OF_FQN);
    const responsePlanESID :UUID = getESIDFromApp(app, RESPONSE_PLAN_FQN);
    const interactionStrategyESID :UUID = getESIDFromApp(app, INTERACTION_STRATEGY_FQN);
    const partOfESID :UUID = getESIDFromApp(app, PART_OF_FQN);

    const responsePlanSearchParams = {
      entitySetId: peopleESID,
      filter: {
        entityKeyIds: [entityKeyId],
        edgeEntitySetIds: [subjectOfESID],
        destinationEntitySetIds: [responsePlanESID],
        sourceEntitySetIds: [],
      }
    };

    const responsePlanResponse = yield call(
      searchEntityNeighborsWithFilterWorker,
      searchEntityNeighborsWithFilter(responsePlanSearchParams)
    );

    if (responsePlanResponse.error) throw responsePlanResponse.error;
    const responsePlans = fromJS(responsePlanResponse.data).get(entityKeyId, List());
    if (responsePlans.count() > 1) {
      LOG.warn('more than one response plan found', entityKeyId);
    }

    const responsePlan = responsePlans
      .getIn([0, 'neighborDetails'], Map());
    const responsePlanEKID :UUID = responsePlan.getIn([OPENLATTICE_ID_FQN, 0]);

    let interactionStrategies = List();
    if (responsePlanEKID) {
      const interactionStrategySearchParams = {
        entitySetId: responsePlanESID,
        filter: {
          entityKeyIds: [responsePlanEKID],
          edgeEntitySetIds: [partOfESID],
          destinationEntitySetIds: [],
          sourceEntitySetIds: [interactionStrategyESID]
        }
      };
      const interactionStrategyResponse = yield call(
        searchEntityNeighborsWithFilterWorker,
        searchEntityNeighborsWithFilter(interactionStrategySearchParams)
      );

      if (interactionStrategyResponse.error) throw interactionStrategyResponse.error;

      interactionStrategies = fromJS(interactionStrategyResponse.data)
        .get(responsePlanEKID, List())
        .map((entity) => entity.get('neighborDetails', Map()))
        .filter((entity) => !entity.has(TECHNIQUES_FQN))
        .sort((stratA, stratB) => {
          const indexA = stratA.getIn([INDEX_FQN, 0]);
          const indexB = stratB.getIn([INDEX_FQN, 0]);

          if (typeof indexA === 'number' && typeof indexB === 'number') {
            return indexA - indexB;
          }
          return 0;
        });
    }

    const interactionStrategyEKIDs :UUID[] = interactionStrategies
      .map((strategy) => strategy.getIn([OPENLATTICE_ID_FQN, 0]));

    const formData = constructResponsePlanFormData(responsePlan, interactionStrategies);
    const entityIndexToIdMap = constructEntityIndexToIdMap(responsePlanEKID, interactionStrategyEKIDs);

    response.data = responsePlan;

    yield put(getResponsePlan.success(action.id, {
      entityIndexToIdMap,
      formData,
      interactionStrategies,
      responsePlan,
    }));
  }
  catch (error) {
    LOG.error(action.type, error);
    response.error = error;
    yield put(getResponsePlan.failure(action.id, error));
  }

  return response;
}

export function* getResponsePlanWatcher() :Generator<*, *, *> {
  yield takeLatest(GET_RESPONSE_PLAN, getResponsePlanWorker);
}

export function* updateResponsePlanWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(updateResponsePlan.request(action.id, value));
    const response = yield call(submitPartialReplaceWorker, submitPartialReplace(value));

    if (response.error) throw response.error;

    yield put(updateResponsePlan.success(action.id));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(updateResponsePlan.failure(action.id, error));
  }
}

export function* updateResponsePlanWatcher() :Generator<*, *, *> {
  yield takeEvery(UPDATE_RESPONSE_PLAN, updateResponsePlanWorker);
}

export function* deleteInteractionStrategiesWorker(action :SequenceAction) :Generator<*, *, *> {
  try {
    const { value } = action;
    if (!isDefined(value)) throw ERR_ACTION_VALUE_NOT_DEFINED;

    yield put(deleteInteractionStrategies.request(action.id));
    const { entityData, path } = value;
    const response = yield call(deleteBulkEntitiesWorker, deleteBulkEntities(entityData));

    if (response.error) throw response.error;

    const entityIndexToIdMap = yield select((state) => state.getIn(['profile', 'responsePlan', 'entityIndexToIdMap']));
    const newEntityIndexToIdMap = removeEntitiesFromEntityIndexToIdMap(entityData, entityIndexToIdMap);

    yield put(deleteInteractionStrategies.success(action.id, { entityIndexToIdMap: newEntityIndexToIdMap, path }));
  }
  catch (error) {
    LOG.error(action.type, error);
    yield put(deleteInteractionStrategies.failure(action.id, error));
  }
}

export function* deleteInteractionStrategiesWatcher() :Generator<*, *, *> {
  yield takeEvery(DELETE_INTERACTION_STRATEGIES, deleteInteractionStrategiesWorker);
}
