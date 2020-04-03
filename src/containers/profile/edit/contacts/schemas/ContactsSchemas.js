import { DataProcessingUtils } from 'lattice-fabricate';

import { PHONE_TYPES } from './constants';

import * as FQN from '../../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const {
  CONTACT_INFORMATION_FQN,
  EMERGENCY_CONTACT_FQN,
  IS_EMERGENCY_CONTACT_FOR_FQN,
} = APP_TYPES_FQNS;

export const schema = {
  definitions: {
    contact: {
      type: 'object',
      properties: {
        [getEntityAddressKey(-1, EMERGENCY_CONTACT_FQN, FQN.PERSON_FIRST_NAME_FQN)]: {
          type: 'string',
          title: 'First Name',
        },
        [getEntityAddressKey(-1, EMERGENCY_CONTACT_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
          type: 'string',
          title: 'Last Name',
        },
        [getEntityAddressKey(-1, IS_EMERGENCY_CONTACT_FOR_FQN, FQN.RELATIONSHIP_FQN)]: {
          type: 'string',
          title: 'Relationship'
        },
        [getEntityAddressKey(-1, CONTACT_INFORMATION_FQN, FQN.CONTACT_PHONE_NUMBER_FQN)]: {
          type: 'string',
          title: 'Phone Number',
        },
        [getEntityAddressKey(-1, CONTACT_INFORMATION_FQN, FQN.EXTENTION_FQN)]: {
          type: 'string',
          title: 'Ext.',
        },
        [getEntityAddressKey(-1, CONTACT_INFORMATION_FQN, FQN.TYPE_FQN)]: {
          type: 'string',
          title: 'Type',
          enum: PHONE_TYPES
        },
        [getEntityAddressKey(-1, CONTACT_INFORMATION_FQN, FQN.GENERAL_NOTES_FQN)]: {
          type: 'string',
          title: 'Notes',
        }
      }
    }
  },
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'array',
      title: '',
      items: {
        $ref: '#/definitions/contact'
      }
    }
  }
};

export const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12',
    'ui:options': {
      orderable: false,
      addButtonText: '+ Add Contact',
      addActionKey: 'addContact'
    },
    items: {
      classNames: 'grid-container',
      [getEntityAddressKey(-1, EMERGENCY_CONTACT_FQN, FQN.PERSON_FIRST_NAME_FQN)]: {
        classNames: 'column-span-4'
      },
      [getEntityAddressKey(-1, EMERGENCY_CONTACT_FQN, FQN.PERSON_LAST_NAME_FQN)]: {
        classNames: 'column-span-4'
      },
      [getEntityAddressKey(-1, IS_EMERGENCY_CONTACT_FOR_FQN, FQN.RELATIONSHIP_FQN)]: {
        classNames: 'column-span-4'
      },
      [getEntityAddressKey(-1, CONTACT_INFORMATION_FQN, FQN.CONTACT_PHONE_NUMBER_FQN)]: {
        classNames: 'column-span-6'
      },
      [getEntityAddressKey(-1, CONTACT_INFORMATION_FQN, FQN.EXTENTION_FQN)]: {
        classNames: 'column-span-2'
      },
      [getEntityAddressKey(-1, CONTACT_INFORMATION_FQN, FQN.TYPE_FQN)]: {
        classNames: 'column-span-4'
      },
      [getEntityAddressKey(-1, CONTACT_INFORMATION_FQN, FQN.GENERAL_NOTES_FQN)]: {
        classNames: 'column-span-12',
        'ui:widget': 'textarea'
      },
      'ui:options': {
        editable: true
      }
    }
  }
};
