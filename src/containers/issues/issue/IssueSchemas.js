// @flow
import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import {
  CATEGORY_FQN,
  DESCRIPTION_FQN,
  PRIORITY_FQN,
  TITLE_FQN,
  STATUS_FQN,
} from '../../../edm/DataModelFqns';
import {
  CATEGORY_VALUES,
  PRIORITIES,
  PRIORITY_VALUES,
} from './constants';

const { OPENLATTICE_ID_FQN } = Constants;
const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { STAFF_FQN, ISSUE_FQN } = APP_TYPES_FQNS;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, ISSUE_FQN, TITLE_FQN)]: {
          type: 'string',
          title: 'Title'
        },
        [getEntityAddressKey(0, STAFF_FQN, OPENLATTICE_ID_FQN)]: {
          type: 'string',
          title: 'Assignee'
        },
        [getEntityAddressKey(0, ISSUE_FQN, PRIORITY_FQN)]: {
          type: 'string',
          title: 'Priority',
          enum: PRIORITY_VALUES,
          default: PRIORITIES.MEDIUM
        },
        [getEntityAddressKey(0, ISSUE_FQN, CATEGORY_FQN)]: {
          type: 'string',
          title: 'Category',
          enum: CATEGORY_VALUES
        },
        [getEntityAddressKey(0, ISSUE_FQN, DESCRIPTION_FQN)]: {
          type: 'string',
          title: 'Description'
        },
        [getEntityAddressKey(0, ISSUE_FQN, STATUS_FQN)]: {
          type: 'string',
          title: 'Status',
          default: 'Open',
        },
      },
      required: [
        getEntityAddressKey(0, ISSUE_FQN, TITLE_FQN),
        getEntityAddressKey(0, ISSUE_FQN, PRIORITY_FQN),
        getEntityAddressKey(0, ISSUE_FQN, CATEGORY_FQN),
        getEntityAddressKey(0, ISSUE_FQN, DESCRIPTION_FQN),
        getEntityAddressKey(0, STAFF_FQN, OPENLATTICE_ID_FQN),
        getEntityAddressKey(0, ISSUE_FQN, STATUS_FQN),
      ]
    }
  }
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, STAFF_FQN, OPENLATTICE_ID_FQN)]: {
      classNames: 'column-span-12',
    },
    [getEntityAddressKey(0, ISSUE_FQN, TITLE_FQN)]: {
      classNames: 'column-span-12',
    },
    [getEntityAddressKey(0, ISSUE_FQN, PRIORITY_FQN)]: {
      classNames: 'column-span-12',
    },
    [getEntityAddressKey(0, ISSUE_FQN, CATEGORY_FQN)]: {
      classNames: 'column-span-12',
    },
    [getEntityAddressKey(0, ISSUE_FQN, DESCRIPTION_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'textarea'
    },
    [getEntityAddressKey(0, ISSUE_FQN, STATUS_FQN)]: {
      'ui:widget': 'hidden'
    }
  }
};

export {
  schema,
  uiSchema,
};
