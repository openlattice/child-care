// @flow
import React, { Component } from 'react';

import { Map, get, setIn } from 'immutable';
import { Constants } from 'lattice';
import { DataProcessingUtils, Form } from 'lattice-fabricate';
import {
  Card,
  CardHeader,
  CardSegment,
  Spinner
} from 'lattice-ui-kit';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import {
  deleteOfficerSafetyConcerns,
  submitOfficerSafetyConcerns,
  updateOfficerSafetyConcerns,
} from './OfficerSafetyActions';
import { schema, uiSchema } from './schemas/OfficerSafetyConcernsSchemas';

import { COMPLETED_DT_FQN, CONTEXT_FQN } from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { reduceRequestStates } from '../../../../utils/StateUtils';
import { isValidUuid } from '../../../../utils/Utils';

const { OPENLATTICE_ID_FQN } = Constants;

const {
  BEHAVIOR_FQN,
  PART_OF_FQN,
  INTERACTION_STRATEGY_FQN,
  OFFICER_SAFETY_CONCERNS_FQN,
  PEOPLE_FQN,
  RESPONSE_PLAN_FQN,
  SUBJECT_OF_FQN,
} = APP_TYPES_FQNS;

const {
  getPageSectionKey,
  getEntityAddressKey,
  processAssociationEntityData,
  processEntityData,
} = DataProcessingUtils;

type Props = {
  actions :{
    deleteOfficerSafetyConcerns :RequestSequence;
    submitOfficerSafetyConcerns :RequestSequence;
    updateOfficerSafetyConcerns :RequestSequence;
  },
  entityIndexToIdMap :Map;
  entitySetIds :Map;
  fetchState :RequestState;
  formData :Map;
  personEKID :UUID;
  responsePlanEKID :UUID;
  propertyTypeIds :Map;
  submitState :RequestState;
};

type State = {
  formData :Object;
  prepopulated :boolean;
};

class OfficerSafetyConcernsForm extends Component<Props, State> {

  state = {
    formData: {},
    prepopulated: false
  }

  componentDidMount() {
    this.initializeFormData();
  }

  componentDidUpdate(prevProps :Props) {
    const { formData } = this.props;
    const { formData: prevFormData } = prevProps;

    if (!formData.equals(prevFormData)) {
      this.initializeFormData();
    }
  }

  initializeFormData = () => {
    const { formData } = this.props;
    const prepopulated = formData
      .reduce((isPopulated, value) => isPopulated || !value.isEmpty(), false);

    this.setState({
      formData: formData.toJS(),
      prepopulated
    });
  }

  getAssociations = (formData :Object) => {
    const { personEKID, responsePlanEKID } = this.props;
    const nowAsIsoString :string = DateTime.local().toISO();
    const safetyAssociations = this.getOfficerSafetyAssocations(
      formData,
      getPageSectionKey(1, 1),
      nowAsIsoString,
      responsePlanEKID
    );

    const triggerAssociations = this.getTriggerAssociations(
      formData,
      getPageSectionKey(1, 2),
      nowAsIsoString,
      responsePlanEKID
    );

    const deescalationAssociations = this.getDeescalationAssociations(
      formData,
      getPageSectionKey(1, 3),
      nowAsIsoString,
      responsePlanEKID
    );

    const associations = [
      ...safetyAssociations,
      ...triggerAssociations,
      ...deescalationAssociations
    ];

    // if response plan doesn't exist, add new association
    if (!isValidUuid(responsePlanEKID) && isValidUuid(personEKID)) {
      associations.push(
        [SUBJECT_OF_FQN, personEKID, PEOPLE_FQN, 0, RESPONSE_PLAN_FQN, {
          [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
        }]
      );
    }

    return associations;
  }

  getOfficerSafetyAssocations = (
    formData :Object,
    pageSection :string,
    nowAsIsoString :string,
    idOrIndex :UUID | number = 0,
  ) => {
    const listSize :number = (get(formData, pageSection) || []).length;
    const associations :any[][] = [];
    for (let i = 0; i < listSize; i += 1) {
      associations.push(
        [PART_OF_FQN, i, OFFICER_SAFETY_CONCERNS_FQN, idOrIndex, RESPONSE_PLAN_FQN, {
          [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
        }]
      );
    }

    return associations;
  }

  getTriggerAssociations = (
    formData :Object,
    pageSection :string,
    nowAsIsoString :string,
    idOrIndex :UUID | number = 0,
  ) => {
    const listSize :number = (get(formData, pageSection) || []).length;
    const associations :any[][] = [];
    for (let i = 0; i < listSize; i += 1) {
      associations.push(
        [PART_OF_FQN, i, BEHAVIOR_FQN, idOrIndex, RESPONSE_PLAN_FQN, {
          [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
        }]
      );
    }

    return associations;
  }

  getDeescalationAssociations = (
    formData :Object,
    pageSection :string,
    nowAsIsoString :string,
    idOrIndex :UUID | number = 0,
  ) => {
    const listSize :number = (get(formData, pageSection) || []).length;
    const associations :any[][] = [];
    for (let i = 0; i < listSize; i += 1) {
      associations.push(
        [PART_OF_FQN, i, INTERACTION_STRATEGY_FQN, idOrIndex, RESPONSE_PLAN_FQN, {
          [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
        }]
      );
    }

    return associations;
  }

  handleSubmit = ({ formData } :Object) => {
    const {
      actions,
      entitySetIds,
      propertyTypeIds,
      responsePlanEKID,
      personEKID,
    } = this.props;

    let finalFormData = formData;
    if (!isValidUuid(responsePlanEKID) && isValidUuid(personEKID)) {
      // modify formData to create a blank responsePlan if one doesn't already exist
      finalFormData = setIn(formData, [
        getPageSectionKey(1, 0),
        getEntityAddressKey(0, RESPONSE_PLAN_FQN, CONTEXT_FQN)
      ], undefined);
    }
    const entityData = processEntityData(finalFormData, entitySetIds, propertyTypeIds);
    const associationEntityData = processAssociationEntityData(
      this.getAssociations(finalFormData),
      entitySetIds,
      propertyTypeIds
    );

    actions.submitOfficerSafetyConcerns({
      associationEntityData,
      entityData,
      path: [],
      properties: formData
    });
  }

  handleAddOfficerSafetyConcern = ({
    entityData,
    formData,
    path,
    properties
  } :Object) => {
    const {
      actions,
      entitySetIds,
      propertyTypeIds,
      responsePlanEKID,
    } = this.props;

    if (responsePlanEKID) {
      const associations = this.getAssociations(formData);
      const associationEntityData = processAssociationEntityData(associations, entitySetIds, propertyTypeIds);

      actions.submitOfficerSafetyConcerns({
        associationEntityData,
        entityData,
        path,
        properties
      });
    }
  }

  handleChange = ({ formData } :Object) => {
    this.setState({ formData });
  }

  render() {
    const {
      actions,
      entityIndexToIdMap,
      entitySetIds,
      fetchState,
      propertyTypeIds,
      submitState,
    } = this.props;
    const { formData, prepopulated } = this.state;
    const formContext = {
      addActions: {
        addOfficerSafetyConcerns: this.handleAddOfficerSafetyConcern,
        addTrigger: this.handleAddOfficerSafetyConcern,
        addDeescalationTechnique: this.handleAddOfficerSafetyConcern
      },
      deleteAction: actions.deleteOfficerSafetyConcerns,
      editAction: actions.updateOfficerSafetyConcerns,
      entityIndexToIdMap,
      entitySetIds,
      mappers: {},
      propertyTypeIds,
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
          Officer Safety
        </CardHeader>
        <Form
            isSubmitting={submitState === RequestStates.PENDING}
            disabled={prepopulated}
            formContext={formContext}
            formData={formData}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
            schema={schema}
            uiSchema={uiSchema} />
      </Card>
    );
  }
}

const mapStateToProps = (state :Map) => {
  const fetchSafetyStates = [
    state.getIn(['profile', 'responsePlan', 'fetchState']),
    state.getIn(['profile', 'officerSafety', 'fetchState'])
  ];

  return {
    entityIndexToIdMap: state.getIn(['profile', 'officerSafety', 'entityIndexToIdMap'], Map()),
    entitySetIds: state.getIn(['app', 'selectedOrgEntitySetIds'], Map()),
    fetchState: reduceRequestStates(fetchSafetyStates),
    formData: state.getIn(['profile', 'officerSafety', 'formData'], Map()),
    propertyTypeIds: state.getIn(['edm', 'fqnToIdMap'], Map()),
    responsePlanEKID: state.getIn(['profile', 'responsePlan', 'data', OPENLATTICE_ID_FQN, 0]),
    submitState: state.getIn(['profile', 'officerSafety', 'submitState'], RequestStates.STANDBY),
  };
};

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    deleteOfficerSafetyConcerns,
    submitOfficerSafetyConcerns,
    updateOfficerSafetyConcerns,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(OfficerSafetyConcernsForm);
