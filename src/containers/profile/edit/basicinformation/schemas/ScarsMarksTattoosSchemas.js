// @flow
import { DataProcessingUtils } from 'lattice-fabricate';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import { DESCRIPTION_FQN } from '../../../../../edm/DataModelFqns';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { IDENTIFYING_CHARACTERISTICS_FQN } = APP_TYPES_FQNS;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: '',
      properties: {
        [getEntityAddressKey(0, IDENTIFYING_CHARACTERISTICS_FQN, DESCRIPTION_FQN)]: {
          type: 'string',
          title: 'Scars, Marks & Tattoos'
        }
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
    [getEntityAddressKey(0, IDENTIFYING_CHARACTERISTICS_FQN, DESCRIPTION_FQN)]: {
      classNames: 'column-span-12'
    }
  }
};

export {
  schema,
  uiSchema
};
