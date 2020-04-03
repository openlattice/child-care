import { Constants } from 'lattice';
import { DataProcessingUtils } from 'lattice-fabricate';

import { NOTES_FQN } from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';

const { OPENLATTICE_ID_FQN } = Constants;
const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { RESPONSE_PLAN_FQN, STAFF_FQN } = APP_TYPES_FQNS;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, STAFF_FQN, OPENLATTICE_ID_FQN)]: {
          type: 'string',
          title: 'Responsible Officer',
          enum: []
        },
        [getEntityAddressKey(0, RESPONSE_PLAN_FQN, NOTES_FQN)]: {
          type: 'string',
          title: 'Internal Team Notes'
        }
      },
      required: [getEntityAddressKey(0, STAFF_FQN, OPENLATTICE_ID_FQN)]
    }
  }
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, STAFF_FQN, OPENLATTICE_ID_FQN)]: {
      classNames: 'column-span-6'
    },
    [getEntityAddressKey(0, RESPONSE_PLAN_FQN, NOTES_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'textarea'
    },
  },
};

export {
  schema,
  uiSchema
};
