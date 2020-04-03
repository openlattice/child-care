// @flow
import { DataProcessingUtils } from 'lattice-fabricate';
import { APP_TYPES_FQNS, STATES } from '../../../../../shared/Consts';
import {
  LOCATION_NAME_FQN,
  LOCATION_STREET_FQN,
  LOCATION_ADDRESS_LINE_2_FQN,
  LOCATION_CITY_FQN,
  LOCATION_STATE_FQN,
  LOCATION_ZIP_FQN,
} from '../../../../../edm/DataModelFqns';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const {
  LOCATION_FQN,
} = APP_TYPES_FQNS;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: ' ',
      properties: {
        [getEntityAddressKey(0, LOCATION_FQN, LOCATION_NAME_FQN)]: {
          type: 'string',
          title: 'Building Name'
        },
        [getEntityAddressKey(0, LOCATION_FQN, LOCATION_STREET_FQN)]: {
          type: 'string',
          title: 'Address Line 1'
        },
        [getEntityAddressKey(0, LOCATION_FQN, LOCATION_ADDRESS_LINE_2_FQN)]: {
          type: 'string',
          title: 'Address Line 2',
        },
        [getEntityAddressKey(0, LOCATION_FQN, LOCATION_CITY_FQN)]: {
          type: 'string',
          title: 'City',
        },
        [getEntityAddressKey(0, LOCATION_FQN, LOCATION_STATE_FQN)]: {
          type: 'string',
          title: 'State',
          enum: STATES
        },
        [getEntityAddressKey(0, LOCATION_FQN, LOCATION_ZIP_FQN)]: {
          type: 'string',
          title: 'Zip',
        },
      }
    }
  }
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    'ui:options': {
      editable: true
    },
    [getEntityAddressKey(0, LOCATION_FQN, LOCATION_NAME_FQN)]: {
      classNames: 'column-span-6'
    },
    [getEntityAddressKey(0, LOCATION_FQN, LOCATION_STREET_FQN)]: {
      classNames: 'column-span-8'
    },
    [getEntityAddressKey(0, LOCATION_FQN, LOCATION_ADDRESS_LINE_2_FQN)]: {
      classNames: 'column-span-8'
    },
    [getEntityAddressKey(0, LOCATION_FQN, LOCATION_CITY_FQN)]: {
      classNames: 'column-span-6'
    },
    [getEntityAddressKey(0, LOCATION_FQN, LOCATION_STATE_FQN)]: {
      classNames: 'column-span-3'
    },
    [getEntityAddressKey(0, LOCATION_FQN, LOCATION_ZIP_FQN)]: {
      classNames: 'column-span-3'
    },
  }
};

export {
  schema,
  uiSchema
};
