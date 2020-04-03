// @flow
import { DataProcessingUtils } from 'lattice-fabricate';
import { APP_TYPES_FQNS } from '../../../../../shared/Consts';
import {
  HEIGHT_FQN,
  WEIGHT_FQN,
  EYE_COLOR_FQN,
  HAIR_COLOR_FQN,
} from '../../../../../edm/DataModelFqns';
import {
  EYE_COLOR_VALUES,
  HAIR_COLOR_VALUES
} from '../../../constants';

const { getEntityAddressKey, getPageSectionKey } = DataProcessingUtils;
const { PHYSICAL_APPEARANCE_FQN } = APP_TYPES_FQNS;

const schema = {
  type: 'object',
  title: '',
  properties: {
    [getPageSectionKey(1, 1)]: {
      type: 'object',
      title: ' ',
      properties: {
        [getEntityAddressKey(0, PHYSICAL_APPEARANCE_FQN, HEIGHT_FQN)]: {
          type: 'number',
          title: 'Height'
        },
        [getEntityAddressKey(0, PHYSICAL_APPEARANCE_FQN, WEIGHT_FQN)]: {
          type: 'number',
          title: 'Weight'
        },
        [getEntityAddressKey(0, PHYSICAL_APPEARANCE_FQN, EYE_COLOR_FQN)]: {
          type: 'string',
          title: 'Eye Color',
          enum: EYE_COLOR_VALUES
        },
        [getEntityAddressKey(0, PHYSICAL_APPEARANCE_FQN, HAIR_COLOR_FQN)]: {
          type: 'string',
          title: 'Hair Color',
          enum: HAIR_COLOR_VALUES
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
    [getEntityAddressKey(0, PHYSICAL_APPEARANCE_FQN, HEIGHT_FQN)]: {
      classNames: 'column-span-3'
    },
    [getEntityAddressKey(0, PHYSICAL_APPEARANCE_FQN, WEIGHT_FQN)]: {
      classNames: 'column-span-3'
    },
    [getEntityAddressKey(0, PHYSICAL_APPEARANCE_FQN, EYE_COLOR_FQN)]: {
      classNames: 'column-span-3'
    },
    [getEntityAddressKey(0, PHYSICAL_APPEARANCE_FQN, HAIR_COLOR_FQN)]: {
      classNames: 'column-span-3'
    }
  }
};

export {
  schema,
  uiSchema
};
