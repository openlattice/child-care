// @flow
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';

import styled from 'styled-components';
import { List, Map, removeIn } from 'immutable';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import { DateTime } from 'luxon';
import { useDispatch, useSelector } from 'react-redux';

import { resetIssue, submitIssue, updateIssue } from './IssueActions';
import { schema, uiSchema } from './IssueSchemas';
import { addIssueTimestamps, constructFormData, getIssueAssociations } from './IssueUtils';

import { useFormData } from '../../../components/hooks';
import { OPENLATTICE_ID_FQN } from '../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../shared/Consts';
import { hydrateSchemaWithStaff } from '../../profile/edit/about/AboutUtils';
import { getResponsibleUserOptions } from '../../staff/StaffActions';

const { STAFF_FQN } = APP_TYPES_FQNS;
const {
  findEntityAddressKeyFromMap,
  getEntityAddressKey,
  getPageSectionKey,
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
  assignee :Map;
  currentUser :Map;
  defaultComponent ? :string;
  edit ? :boolean;
  issue :Map;
  person :Map;
};

const IssueForm = (props :Props, ref) => {
  const {
    assignee,
    currentUser,
    defaultComponent,
    edit,
    issue,
    person,
  } = props;

  const responsibleUsers :List<Map> = useSelector((store :Map) => store.getIn(['staff', 'responsibleUsers', 'data']));
  const entitySetIds :Map = useSelector((store :Map) => store.getIn(['app', 'selectedOrgEntitySetIds'], Map()));
  const propertyTypeIds :Map = useSelector((store :Map) => store.getIn(['edm', 'fqnToIdMap'], Map()));
  const entityIndexToIdMap :Map = useSelector((store :Map) => store
    .getIn(['issues', 'issue', 'entityIndexToIdMap'], Map()));

  const [changeSchema, setSchema] = useState(schema);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetIssue());

    return () => dispatch(resetIssue());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getResponsibleUserOptions());
  }, [dispatch]);

  useEffect(() => {
    const newSchema = hydrateSchemaWithStaff(schema, responsibleUsers);
    setSchema(newSchema);
  }, [responsibleUsers]);

  const defaultFormData = useMemo(() => constructFormData({
    assignee,
    defaultComponent,
    issue
  }), [assignee, defaultComponent, issue]);

  const [formData] = useFormData(defaultFormData);

  const handleSubmit = useCallback((payload :any) => {
    const { formData: newFormData } = payload;

    const now = DateTime.local();

    const associationEntityData = processAssociationEntityData(
      getIssueAssociations(newFormData, person, currentUser, now),
      entitySetIds,
      propertyTypeIds
    );

    const withoutAssignee = removeIn(
      newFormData,
      [getPageSectionKey(1, 1), getEntityAddressKey(0, STAFF_FQN, OPENLATTICE_ID_FQN)]
    );

    const withTimestamps = addIssueTimestamps(withoutAssignee, now);

    const entityData = processEntityData(withTimestamps, entitySetIds, propertyTypeIds);

    dispatch(submitIssue({
      associationEntityData,
      entityData,
    }));
  }, [
    currentUser,
    dispatch,
    entitySetIds,
    person,
    propertyTypeIds
  ]);

  const handleEdit = useCallback((payload :any) => {
    const { formData: newFormData } = payload;

    const now = DateTime.local();
    const withTimestamps = addIssueTimestamps(newFormData, now, true);
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

    dispatch(updateIssue({
      entityData,
      path: [],
      properties: newFormData,
      entityIndexToIdMap,
      responsibleUsers,
    }));
  }, [
    defaultFormData,
    dispatch,
    entityIndexToIdMap,
    entitySetIds,
    propertyTypeIds,
    responsibleUsers,
  ]);

  const onSubmit = edit ? handleEdit : handleSubmit;

  return (
    <StyledForm
        hideSubmit
        noPadding
        ref={ref}
        onSubmit={onSubmit}
        formData={formData}
        schema={changeSchema}
        uiSchema={uiSchema} />
  );
};

IssueForm.defaultProps = {
  defaultComponent: '',
  edit: false
};

export default React.memo<Props, typeof StyledForm>(
  React.forwardRef(IssueForm)
);
