// @flow
import React, {
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';

import { resetEncampment, submitEncampment, updateEncampment } from './EncampmentActions';
import { schema, uiSchema } from './EncampmentSchemas';
import {
  addEncampmentTimestamps,
  constructFormData,
  getEncampmentAssociations,
} from './EncampmentUtils';

import { useFormData } from '../../../components/hooks';

const {
  findEntityAddressKeyFromMap,
  processAssociationEntityData,
  processEntityData,
  processEntityDataForPartialReplace,
  replaceEntityAddressKeys,
} = DataProcessingUtils;

const StyledForm = styled(Form)`
  max-width: 100%;
  width: 500px;
`;

type Props = {
  currentUser :Map;
  edit ? :boolean;
  encampment :Map;
  encampmentLocation :Map;
};

const EncampmentForm = (props :Props, ref) => {
  return null;
};

export default EncampmentForm;
