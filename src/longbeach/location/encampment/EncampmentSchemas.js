// @flow
import { DataProcessingUtils } from 'lattice-fabricate';

import {
  DESCRIPTION_FQN,
  NUMBER_OF_PEOPLE_FQN,
} from '../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../shared/Consts';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { ENCAMPMENT_FQN } = APP_TYPES_FQNS;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, ENCAMPMENT_FQN, NUMBER_OF_PEOPLE_FQN)]: {
          type: 'integer',
          title: '# of Occupants',
          minimum: 0,
        },
        [getEntityAddressKey(0, ENCAMPMENT_FQN, DESCRIPTION_FQN)]: {
          type: 'string',
          title: 'Description'
        },
      },
      required: [
        getEntityAddressKey(0, ENCAMPMENT_FQN, NUMBER_OF_PEOPLE_FQN),
      ]
    }
  }
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, ENCAMPMENT_FQN, NUMBER_OF_PEOPLE_FQN)]: {
      classNames: 'column-span-8',
    },
    [getEntityAddressKey(0, ENCAMPMENT_FQN, DESCRIPTION_FQN)]: {
      classNames: 'column-span-12',
      'ui:widget': 'textarea'
    },
  }
};

export {
  schema,
  uiSchema,
};
