/*
 * @flow
 */

import { Map, fromJS } from 'immutable';
import { RequestStates } from 'redux-reqseq';
import { v4 as uuid } from 'uuid';
import type { SequenceAction } from 'redux-reqseq';

import {
  INITIALIZE_APPLICATION,
  LOAD_APP,
  RELOAD_TOKEN,
  SWITCH_LANGUAGE,
  initializeApplication,
  loadApp,
  reloadToken,
} from './AppActions';

import { APP, REQUEST_STATE, RS_INITIAL_STATE } from '../../core/redux/constants';
import { getFqn } from '../../utils/DataUtils';
import { LANGUAGES } from '../../utils/constants/Labels';
import { APPLICAITON } from '../../utils/constants/StateConstants';

const {
  ENTITY_SET_ID,
  GET_TEXT,
  PROPERTY_TYPES_BY_FQN,
  PROPERTY_TYPES_BY_ID,
  SESSION_ID,
  TOKEN,
  TOKEN_EXP,
} = APPLICAITON;

const INITIAL_STATE :Map<*, *> = fromJS({
  [INITIALIZE_APPLICATION]: RS_INITIAL_STATE,
  [LOAD_APP]: RS_INITIAL_STATE,
  [RELOAD_TOKEN]: RS_INITIAL_STATE,

  actions: {
    loadApp: Map(),
  },
  [APP]: Map(),
  initializeState: RequestStates.STANDBY,
  [ENTITY_SET_ID]: null,
  [PROPERTY_TYPES_BY_ID]: Map(),
  [PROPERTY_TYPES_BY_FQN]: Map(),
  [TOKEN]: null,
  [TOKEN_EXP]: -1,
  [GET_TEXT]: (label) => label[LANGUAGES.en],
  [SESSION_ID]: uuid()
});

export default function appReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case initializeApplication.case(action.type): {
      return initializeApplication.reducer(state, action, {
        REQUEST: () => state
          .setIn([INITIALIZE_APPLICATION, REQUEST_STATE], RequestStates.PENDING)
          .setIn([INITIALIZE_APPLICATION, action.id], action),
        SUCCESS: () => state
          .setIn([INITIALIZE_APPLICATION, REQUEST_STATE], RequestStates.SUCCESS),
        FAILURE: () => state
          .setIn([INITIALIZE_APPLICATION, REQUEST_STATE], RequestStates.FAILURE),
        FINALLY: () => state.deleteIn([INITIALIZE_APPLICATION, action.id])
      });
    }

    case reloadToken.case(action.type): {
      return reloadToken.reducer(state, action, {
        REQUEST: () => state
          .setIn([RELOAD_TOKEN, REQUEST_STATE], RequestStates.PENDING)
          .setIn([RELOAD_TOKEN, action.id], action),
        SUCCESS: () => state
          .set(TOKEN, action.value.token)
          .set(TOKEN_EXP, action.value.tokenExp)
          .setIn([RELOAD_TOKEN, REQUEST_STATE], RequestStates.SUCCESS),
        FAILURE: () => state
          .setIn([RELOAD_TOKEN, REQUEST_STATE], RequestStates.FAILURE),
        FINALLY: () => state.deleteIn([RELOAD_TOKEN, action.id])
      });
    }

    case loadApp.case(action.type): {
      return loadApp.reducer(state, action, {
        REQUEST: () => {
          const seqAction :SequenceAction = action;
          return state
            .setIn([LOAD_APP, REQUEST_STATE], RequestStates.PENDING)
            .setIn([LOAD_APP, action.id], action)
            .setIn(['actions', 'loadApp', seqAction.id], fromJS(seqAction));
        },
        SUCCESS: () => {

          const seqAction :SequenceAction = action;
          if (!state.hasIn([LOAD_APP, seqAction.id])) {
            return state;
          }

          const { value } = seqAction;
          if (value === null || value === undefined) {
            return state;
          }

          const {
            entitySetId,
            propertyTypes
          } = value;

          let propertyTypesById = Map();
          let propertyTypesByFqn = Map();

          fromJS(propertyTypes).forEach((propertyType) => {
            const id = propertyType.get('id');
            const fqn = getFqn(propertyType.get('type'));

            propertyTypesById = propertyTypesById.set(id, propertyType);
            propertyTypesByFqn = propertyTypesByFqn.set(fqn, propertyType);
          });

          let defaultLanguage = LANGUAGES.en;
          const { language } = window.navigator;
          if (language && language.includes('es')) {
            defaultLanguage = LANGUAGES.es;
          }

          return state
            .set(ENTITY_SET_ID, entitySetId)
            .set(PROPERTY_TYPES_BY_ID, propertyTypesById)
            .set(PROPERTY_TYPES_BY_FQN, propertyTypesByFqn)
            .set(GET_TEXT, (label) => label[defaultLanguage])
            .setIn([LOAD_APP, REQUEST_STATE], RequestStates.SUCCESS);
        },
        FAILURE: () => state.setIn([LOAD_APP, REQUEST_STATE], RequestStates.FAILURE),
        FINALLY: () => {
          const seqAction :SequenceAction = action;
          return state.deleteIn([LOAD_APP, seqAction.id]);
        }
      });
    }

    case SWITCH_LANGUAGE: {
      return state.set(GET_TEXT, (labels) => labels[action.value]);
    }

    default:
      return state;
  }
}
