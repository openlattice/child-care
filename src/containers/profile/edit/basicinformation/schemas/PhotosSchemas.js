// @flow
import { DataProcessingUtils } from 'lattice-fabricate';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import { IMAGE_DATA_FQN } from '../../../../../edm/DataModelFqns';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { IMAGE_FQN } = APP_TYPES_FQNS;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, IMAGE_FQN, IMAGE_DATA_FQN)]: {
          title: 'Update Photo',
          type: 'string',
          format: 'data-url'
        }
      },
      required: [getEntityAddressKey(0, IMAGE_FQN, IMAGE_DATA_FQN)]
    }
  }
};

const uiSchema = {
  [getPageSectionKey(1, 1)]: {
    classNames: 'column-span-12 grid-container',
    [getEntityAddressKey(0, IMAGE_FQN, IMAGE_DATA_FQN)]: {
      classNames: 'column-span-12',
      'ui:options': {
        accept: '.jpg, .png'
      }
    }
  }
};

export {
  schema,
  uiSchema
};
