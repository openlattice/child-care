// @flow

import React, { useEffect, useMemo, useState } from 'react';
import { Form, DataProcessingUtils } from 'lattice-fabricate';
import {
  Card,
  CardSegment,
  CardHeader,
  Spinner,
} from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import { Constants } from 'lattice';
import {
  List,
  Map,
  removeIn,
} from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
import type { Match } from 'react-router';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import { useFormData } from '../../../../components/hooks';
import { getAboutPlan, submitAboutPlan, updateAboutPlan } from './AboutActions';
import { getResponsibleUserOptions } from '../../../staff/StaffActions';
import { schema, uiSchema } from './AboutSchemas';
import { reduceRequestStates } from '../../../../utils/StateUtils';
import { getAboutPlanAssociations, hydrateSchemaWithStaff } from './AboutUtils';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { PROFILE_ID_PARAM } from '../../../../core/router/Routes';

const { STAFF_FQN } = APP_TYPES_FQNS;
const { OPENLATTICE_ID_FQN } = Constants;
const {
  getEntityAddressKey,
  getPageSectionKey,
  processAssociationEntityData,
  processEntityData
} = DataProcessingUtils;

type Props = {
  actions :{
    getAboutPlan :RequestSequence;
    getResponsibleUserOptions :RequestSequence;
    submitAboutPlan :RequestSequence;
    updateAboutPlan :RequestSequence;
  };
  aboutFormData :Map;
  entityIndexToIdMap :Map;
  entitySetIds :Map;
  fetchState :RequestState;
  match :Match;
  propertyTypeIds :Map;
  responsibleUsers :List;
  submitState :RequestState;
};

const AboutForm = (props :Props) => {
  const {
    aboutFormData,
    actions,
    entityIndexToIdMap,
    entitySetIds,
    fetchState,
    match,
    propertyTypeIds,
    responsibleUsers,
    submitState,
  } = props;

  const [formData, setFormData] = useFormData(aboutFormData);
  const [aboutSchema, setSchema] = useState(schema);
  const [prepopulated, setPrepopulated] = useState(false);

  const personEKID :string = match.params[PROFILE_ID_PARAM] || '';
  useEffect(() => {
    actions.getAboutPlan(personEKID);
    actions.getResponsibleUserOptions();
  }, [actions, personEKID]);

  useEffect(() => {
    const newSchema = hydrateSchemaWithStaff(schema, responsibleUsers);
    setSchema(newSchema);
  }, [responsibleUsers, setSchema]);

  useEffect(() => {
    if (!entityIndexToIdMap.isEmpty()) {
      setPrepopulated(true);
    }
  }, [entityIndexToIdMap, setPrepopulated]);

  const formContext = useMemo(() => ({
    editAction: actions.updateAboutPlan,
    entityIndexToIdMap,
    entitySetIds,
    mappers: {},
    propertyTypeIds,
  }), [
    entitySetIds,
    actions,
    entityIndexToIdMap,
    propertyTypeIds,
  ]);

  const handleSubmit = (payload :any) => {
    const { formData: newFormData } = payload;
    const nowAsIsoString :string = DateTime.local().toISO();

    const associationEntityData = processAssociationEntityData(
      getAboutPlanAssociations(newFormData, personEKID, nowAsIsoString),
      entitySetIds,
      propertyTypeIds
    );

    const withoutResponsibleUser = removeIn(
      newFormData,
      [getPageSectionKey(1, 1), getEntityAddressKey(0, STAFF_FQN, OPENLATTICE_ID_FQN)]
    );

    const entityData = processEntityData(withoutResponsibleUser, entitySetIds, propertyTypeIds);

    actions.submitAboutPlan({
      associationEntityData,
      entityData,
      path: [],
      properties: newFormData
    });
  };

  if (fetchState === RequestStates.PENDING) {
    return (
      <Card>
        <CardSegment vertical>
          <Spinner size="2x" />
        </CardSegment>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader mode="primary" padding="sm">
        About Plan
      </CardHeader>
      <Form
          disabled={prepopulated}
          formContext={formContext}
          formData={formData}
          isSubmitting={submitState === RequestStates.PENDING}
          onChange={setFormData}
          onSubmit={handleSubmit}
          schema={aboutSchema}
          uiSchema={uiSchema} />
    </Card>
  );
};

const mapStateToProps = (state :Map) => {

  const fetchState = reduceRequestStates([
    state.getIn(['profile', 'about', 'fetchState'], RequestStates.STANDBY),
    state.getIn(['staff', 'responsibleUsers', 'fetchState'], RequestStates.STANDBY)
  ]);

  return {
    aboutFormData: state.getIn(['profile', 'about', 'formData'], Map()),
    entityIndexToIdMap: state.getIn(['profile', 'about', 'entityIndexToIdMap'], Map()),
    entitySetIds: state.getIn(['app', 'selectedOrgEntitySetIds'], Map()),
    fetchState,
    propertyTypeIds: state.getIn(['edm', 'fqnToIdMap'], Map()),
    responsibleUsers: state.getIn(['staff', 'responsibleUsers', 'data'], List()),
    submitState: state.getIn(['profile', 'about', 'submitState'], RequestStates.STANDBY)
  };
};

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    getAboutPlan,
    getResponsibleUserOptions,
    submitAboutPlan,
    updateAboutPlan,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(AboutForm);
