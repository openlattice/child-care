import { DataProcessingUtils } from 'lattice-fabricate';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import {
  CONTEXT_FQN,
  DESCRIPTION_FQN,
  INDEX_FQN,
  TITLE_FQN
} from '../../../../../edm/DataModelFqns';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const {
  INTERACTION_STRATEGY_FQN,
  RESPONSE_PLAN_FQN,
} = APP_TYPES_FQNS;

export const schema = {
  definitions: {
    interactionStrategy: {
      type: 'object',
      properties: {
        [getEntityAddressKey(-1, INTERACTION_STRATEGY_FQN, TITLE_FQN)]: {
          type: 'string',
          title: 'Title',
        },
        [getEntityAddressKey(-1, INTERACTION_STRATEGY_FQN, DESCRIPTION_FQN)]: {
          type: 'string',
          title: 'Description',
        },
        [getEntityAddressKey(-1, INTERACTION_STRATEGY_FQN, INDEX_FQN)]: {
          type: 'number',
        }
      },
      required: [getEntityAddressKey(-1, INTERACTION_STRATEGY_FQN, TITLE_FQN)]
    }
  },
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: 'Background Information',
      properties: {
        [getEntityAddressKey(0, RESPONSE_PLAN_FQN, CONTEXT_FQN)]: {
          type: 'string',
          title: 'Summary'
        }
      }
    },
    [getPageSectionKey(1, 2)]: {
      type: 'array',
      title: 'Response Plan',
      items: {
        $ref: '#/definitions/interactionStrategy'
      }
    }
  }
};

export const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, RESPONSE_PLAN_FQN, CONTEXT_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'textarea'
    },
    'ui:options': {
      editable: true
    }
  },
  [getPageSectionKey(1, 2)]: {
    classNames: 'column-span-12',
    'ui:options': {
      addButtonText: '+ Add Strategy',
      addActionKey: 'addInteractionStrategy'
    },
    items: {
      classNames: 'grid-container',
      [getEntityAddressKey(-1, INTERACTION_STRATEGY_FQN, TITLE_FQN)]: {
        classNames: 'column-span-12'
      },
      [getEntityAddressKey(-1, INTERACTION_STRATEGY_FQN, DESCRIPTION_FQN)]: {
        classNames: 'column-span-12',
        'ui:widget': 'textarea'
      },
      [getEntityAddressKey(-1, INTERACTION_STRATEGY_FQN, INDEX_FQN)]: {
        'ui:widget': 'hidden'
      },
      'ui:options': {
        editable: true
      }
    }
  }
};
