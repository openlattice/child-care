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
  const {
    currentUser,
    edit,
    encampment,
    encampmentLocation,
  } = props;

  const entitySetIds :Map = useSelector((store :Map) => store.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
  const propertyTypeIds :Map = useSelector((store :Map) => store.getIn(['edm', 'fqnToIdMap'], Map()));
  const entityIndexToIdMap :Map = useSelector((store :Map) => store
    .getIn(['issues', 'issue', 'entityIndexToIdMap'], Map()));

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetEncampment());

    return () => dispatch(resetEncampment());
  }, [dispatch]);

  const defaultFormData = useMemo(() => constructFormData({
    encampment,
    encampmentLocation,
  }), [encampment, encampmentLocation]);

  const [formData] = useFormData(defaultFormData);

  const handleSubmit = useCallback((payload :any) => {
    const { formData: newFormData } = payload;

    const now = DateTime.local();

    const associationEntityData = processAssociationEntityData(
      getEncampmentAssociations(newFormData, currentUser, now),
      entitySetIds,
      propertyTypeIds
    );

    const withTimestamps = addEncampmentTimestamps(newFormData, now);

    const entityData = processEntityData(withTimestamps, entitySetIds, propertyTypeIds);

    dispatch(submitEncampment({
      associationEntityData,
      entityData,
      formData: newFormData
    }));
  }, [
    currentUser,
    dispatch,
    entitySetIds,
    propertyTypeIds
  ]);

  const handleEdit = useCallback((payload :any) => {
    const { formData: newFormData } = payload;

    const now = DateTime.local();
    const withTimestamps = addEncampmentTimestamps(newFormData, now, true);
    const draftWithKeys = replaceEntityAddressKeys(
      withTimestamps,
      findEntityAddressKeyFromMap(entityIndexToIdMap)
    );

    const originalWithKeys = replaceEntityAddressKeys(
      defaultFormData,
      findEntityAddressKeyFromMap(entityIndexToIdMap)
    );

    const entityData = processEntityDataForPartialReplace(
      draftWithKeys,
      originalWithKeys,
      entitySetIds,
      propertyTypeIds
    );

    dispatch(updateEncampment({
      entityData,
      path: [],
      properties: newFormData,
      entityIndexToIdMap,
    }));
  }, [
    defaultFormData,
    dispatch,
    entityIndexToIdMap,
    entitySetIds,
    propertyTypeIds,
  ]);

  const onSubmit = edit ? handleEdit : handleSubmit;

  return (
    <StyledForm
        hideSubmit
        noPadding
        ref={ref}
        onSubmit={onSubmit}
        formData={formData}
        schema={schema}
        uiSchema={uiSchema} />
  );
};

EncampmentForm.defaultProps = {
  edit: false
};

export default React.memo<Props, typeof StyledForm>(
  React.forwardRef(EncampmentForm)
);
