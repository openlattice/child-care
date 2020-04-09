/*
 * @flow
 */

import {
  Map,
  fromJS,
  get,
  getIn,
} from 'immutable';
import { Models } from 'lattice';
import { AccountUtils } from 'lattice-auth';
import { RequestStates } from 'redux-reqseq';
import type { SequenceAction } from 'redux-reqseq';


import { LANGUAGES } from '../../utils/constants/Labels';
import { getFqn } from '../../utils/DataUtils';
import {
  SWITCH_LANGUAGE,
  initializeApplication,
  loadApp,
} from './AppActions';

const INITIAL_STATE :Map<*, *> = fromJS({
  actions: {
    loadApp: Map(),
  },
  app: Map(),
  appTypes: Map(),
  errors: {
    loadApp: Map(),
  },
  isLoadingApp: true,
  organizations: Map(),
  selectedOrganizationId: '',
  selectedOrganizationSettings: Map(),
  initializeState: RequestStates.STANDBY,
  entitySetId: null,
  hospitalsEntitySetId: null,
  propertyTypesById: Map(),
  propertyTypesByFqn: Map(),
  renderText: (label) => label[LANGUAGES.en]
});

export default function appReducer(state :Map<*, *> = INITIAL_STATE, action :Object) {

  switch (action.type) {

    case initializeApplication.case(action.type): {
      return initializeApplication.reducer(state, action, {
        REQUEST: () => state.set('initializeState', RequestStates.PENDING),
        SUCCESS: () => state.set('initializeState', RequestStates.SUCCESS),
        FAILURE: () => state.set('initializeState', RequestStates.FAILURE),
      });
    }

    case loadApp.case(action.type): {
      return loadApp.reducer(state, action, {
        REQUEST: () => {
          const seqAction :SequenceAction = action;
          return state
            .set('isLoadingApp', true)
            .set('selectedOrganizationId', '')
            .setIn(['actions', 'loadApp', seqAction.id], fromJS(seqAction));
        },
        SUCCESS: () => {

          const seqAction :SequenceAction = action;
          if (!state.hasIn(['actions', 'loadApp', seqAction.id])) {
            return state;
          }

          const { value } = seqAction;
          if (value === null || value === undefined) {
            return state;
          }

          const {
            entitySetId,
            hospitalsEntitySetId,
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
            .set('entitySetId', entitySetId)
            .set('hospitalsEntitySetId', hospitalsEntitySetId)
            .set('propertyTypesById', propertyTypesById)
            .set('propertyTypesByFqn', propertyTypesByFqn)
            .set('renderText', (label) => label[defaultLanguage]);
        },
        FINALLY: () => {
          const seqAction :SequenceAction = action;
          return state
            .set('isLoadingApp', false)
            .deleteIn(['actions', 'loadApp', seqAction.id]);
        }
      });
    }

    case SWITCH_LANGUAGE: {
      return state.set('renderText', (labels) => labels[action.value]);
    }

    default:
      return state;
  }
}
