/*
 * @flow
 */

import {
  all,
  call,
  put,
  select,
  takeEvery,
} from '@redux-saga/core/effects';
import {
  List,
  Map,
  Set,
  fromJS
} from 'immutable';
import { Constants } from 'lattice';
import { AuthUtils } from 'lattice-auth';
import {
  DataApiActions,
  DataApiSagas,
  OrganizationsApiActions,
  OrganizationsApiSagas,
  SearchApiActions,
  SearchApiSagas,
} from 'lattice-sagas';
import type { SequenceAction } from 'redux-reqseq';

import {
  ADD_NEW_STAFF_MEMBER,
  GET_CURRENT_USER_STAFF_MEMBER_DATA,
  GET_RESPONSIBLE_USER_OPTIONS,
  addNewStaffMember,
  getCurrentUserStaffMemberData,
  getResponsibleUserOptions,
} from './StaffActions';

import Logger from '../../utils/Logger';
import * as FQN from '../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../shared/Consts';
import { getESIDFromApp, getStaffESId } from '../../utils/AppUtils';
import { getSearchTerm } from '../../utils/DataUtils';
import { ERR_ACTION_VALUE_NOT_DEFINED, ERR_WORKER_SAGA } from '../../utils/Errors';

const { OPENLATTICE_ID_FQN } = Constants;

const LOG = new Logger('StaffSagas');

const { searchEntitySetData } = SearchApiActions;
const { searchEntitySetDataWorker } = SearchApiSagas;

const { createOrMergeEntityData } = DataApiActions;
const { createOrMergeEntityDataWorker } = DataApiSagas;

const { getAllUsersOfRole } = OrganizationsApiActions;
const { getAllUsersOfRoleWorker } = OrganizationsApiSagas;

const { STAFF_FQN } = APP_TYPES_FQNS;

/*
 *
 * StaffSagas.addNewStaffMember()
 *
 */

function* addNewStaffMemberWorker(action :SequenceAction) :Generator<*, *, *> {

  const staffMemberDataByPtId :Object = {};

  const workerResponse :Object = {};

  try {

    const { value } = action;
    if (value === null || value === undefined) {
      throw ERR_ACTION_VALUE_NOT_DEFINED;
    }

    yield put(addNewStaffMember.request(action.id));

    const app = yield select((state) => state.get('app', Map()));
    const staffESId :UUID = getStaffESId(app);
    const personIdPTId :UUID = yield select((state) => state.getIn(['edm', 'fqnToIdMap', FQN.PERSON_ID_FQN]));

    staffMemberDataByPtId[personIdPTId] = [value.email];

    const createStaffResponse = yield call(
      createOrMergeEntityDataWorker,
      createOrMergeEntityData({
        entitySetId: staffESId,
        entityData: [staffMemberDataByPtId]
      })
    );

    if (createStaffResponse.error) throw createStaffResponse.error;

    const staffMemberDataByFQN :Object = {
      [OPENLATTICE_ID_FQN]: fromJS(createStaffResponse).first(),
      [FQN.PERSON_ID_FQN.toString()]: [value.email]
    };

    workerResponse.data = staffMemberDataByFQN;

    yield put(addNewStaffMember.success(action.id, workerResponse.data));
  }
  catch (error) {
    LOG.error(ERR_WORKER_SAGA, error);
    workerResponse.error = error;
    yield put(addNewStaffMember.failure(action.id, workerResponse.error));
  }

  return workerResponse;
}

function* addNewStaffMemberWatcher() :Generator<*, *, *> {

  yield takeEvery(ADD_NEW_STAFF_MEMBER, addNewStaffMemberWorker);
}

/*
 *
 * StaffSagas.getCurrentUserStaffMemberData()
 *
 */

function* getCurrentUserStaffMemberDataWorker(action :SequenceAction) :Generator<*, *, *> {
  const workerResponse = {};
  try {

    const { value } = action;
    if (value === null || value === undefined) {
      throw ERR_ACTION_VALUE_NOT_DEFINED;
    }

    yield put(getCurrentUserStaffMemberData.request(action.id));

    let response :Object = {};
    let userData :?Object;
    const userInfo :Object = AuthUtils.getUserInfo();

    const app = yield select((state) => state.get('app', Map()));
    const entitySetId :UUID = getStaffESId(app);
    const personIdPTId :UUID = yield select((state) => state.getIn(['edm', 'fqnToIdMap', FQN.PERSON_ID_FQN]));
    const searchOptions :Object = {
      maxHits: 10000,
      searchTerm: getSearchTerm(personIdPTId, userInfo.email, true),
      start: 0,
    };

    response = yield call(searchEntitySetDataWorker, searchEntitySetData({ entitySetId, searchOptions }));
    if (response.error) throw response.error;

    const { data: { hits: [searchResult = undefined] = [] } = {} } = response;
    if (!searchResult) {
      // current user is not a member of the staff entity set. try adding.
      if (value.createIfNotExists) {
        const newStaff = yield call(addNewStaffMemberWorker, addNewStaffMember(userInfo));
        if (newStaff.error) throw newStaff.error;
        userData = newStaff.data;
        // TODO: retry / schedule another search in the future
      }
    }
    else {
      userData = searchResult;
    }

    workerResponse.data = userData;

    yield put(getCurrentUserStaffMemberData.success(action.id, workerResponse.data));
  }
  catch (error) {
    LOG.error(ERR_WORKER_SAGA, error);
    workerResponse.error = error;
    yield put(getCurrentUserStaffMemberData.failure(action.id, workerResponse.error));
  }

  return workerResponse;
}

function* getCurrentUserStaffMemberDataWatcher() :Generator<*, *, *> {

  yield takeEvery(GET_CURRENT_USER_STAFF_MEMBER_DATA, getCurrentUserStaffMemberDataWorker);
}

function* getResponsibleUserOptionsWorker(action :SequenceAction) :Generator<any, any, any> {

  try {
    yield put(getResponsibleUserOptions.request(action.id));
    const app :Map = yield select((state) => state.get('app', Map()));
    const entitySetId :UUID = getESIDFromApp(app, STAFF_FQN);
    const personIdPTId :UUID = yield select((state) => state.getIn(['edm', 'fqnToIdMap', FQN.PERSON_ID_FQN]));
    const organizationId :UUID = yield select((state) => state.getIn(['app', 'selectedOrganizationId']));
    const roleIds :List<UUID> = yield select(
      (state) => state.getIn(['app', 'selectedOrganizationSettings', 'private', 'profile'], List())
    );
    const responsibleUserOptions = yield select((state) => state.getIn(['staff', 'responsibleUsers', 'data'], List()));

    const searchOptions :Object = {
      maxHits: 10000,
      searchTerm: getSearchTerm(personIdPTId, '*', false),
      start: 0,
    };

    let responseData = responsibleUserOptions;
    if (responsibleUserOptions.isEmpty()){
      const staffResponse = yield call(
        searchEntitySetDataWorker,
        searchEntitySetData({
          entitySetId,
          searchOptions
        })
      );
  
      if (staffResponse.error) throw staffResponse.error;
  
      responseData = fromJS(staffResponse.data.hits);
      const requestUsers = roleIds.map((roleId) => call(
        getAllUsersOfRoleWorker,
        getAllUsersOfRole({
          organizationId,
          roleId
        })
      )).toJS();
  
      const usersResponses = yield all(requestUsers);
  
      usersResponses.forEach((usersResponse) => {
        if (usersResponse.error) throw usersResponse.error;
      });
  
      const usersResponseData = fromJS(usersResponses);
      const authorizedUsers = Set().withMutations((mutable) => {
        usersResponseData.forEach((roleResponse) => {
          const data = roleResponse.get('data', List());
          data.forEach((user) => {
            mutable.add(user.get('email'));
          });
        });
      });
  
      if (usersResponseData.size) {
        responseData = responseData
          .filter((staff) => {
            const id = staff.getIn([FQN.PERSON_ID_FQN, 0]);
            return authorizedUsers.has(id);
          });
      }
    }

    yield put(getResponsibleUserOptions.success(action.id, responseData));
  }
  catch (error) {
    yield put(getResponsibleUserOptions.failure(action.id));
  }
}

function* getResponsibleUserOptionsWatcher() :Generator<any, any, any> {
  yield takeEvery(GET_RESPONSIBLE_USER_OPTIONS, getResponsibleUserOptionsWorker);
}

export {
  addNewStaffMemberWatcher,
  addNewStaffMemberWorker,
  getCurrentUserStaffMemberDataWatcher,
  getCurrentUserStaffMemberDataWorker,
  getResponsibleUserOptionsWatcher,
  getResponsibleUserOptionsWorker,
};
