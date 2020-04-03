// @flow
import React, { Component } from 'react';
import { DateTime } from 'luxon';
import { Form, DataProcessingUtils } from 'lattice-fabricate';
import {
  Card,
  CardHeader,
  CardSegment,
  Spinner
} from 'lattice-ui-kit';
import { Map } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import {
  updateAddress,
  submitAddress
} from './actions/AddressActions';
import { schema, uiSchema } from './schemas/AddressSchemas';
import { COMPLETED_DT_FQN } from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';

const {
  LOCATED_AT_FQN,
  PEOPLE_FQN,
  LOCATION_FQN,
} = APP_TYPES_FQNS;

const {
  processEntityData,
  processAssociationEntityData
} = DataProcessingUtils;

type Props = {
  actions :{
    submitAddress :RequestSequence;
    updateAddress :RequestSequence;
  },
  entityIndexToIdMap :Map;
  entitySetIds :Map;
  fetchState :RequestState;
  formData :Map;
  personEKID :UUID;
  propertyTypeIds :Map;
  submitState :RequestState;
};

type State = {
  formData :Object;
  prepopulated :boolean;
};

class AddressForm extends Component<Props, State> {

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
    this.setState({
      formData: formData.toJS(),
      prepopulated: !formData.isEmpty()
    });
  }

  getAssociations = () => {
    const { personEKID } = this.props;
    const nowAsIsoString :string = DateTime.local().toISO();
    return [
      [LOCATED_AT_FQN, personEKID, PEOPLE_FQN, 0, LOCATION_FQN, {
        [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
      }],
    ];
  }

  handleSubmit = ({ formData } :Object) => {
    const { actions, entitySetIds, propertyTypeIds } = this.props;
    const entityData = processEntityData(formData, entitySetIds, propertyTypeIds);
    const associationEntityData = processAssociationEntityData(
      this.getAssociations(),
      entitySetIds,
      propertyTypeIds
    );

    actions.submitAddress({
      associationEntityData,
      entityData,
      path: [],
      properties: formData
    });
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
      editAction: actions.updateAddress,
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
          Address
        </CardHeader>
        <Form
            disabled={prepopulated}
            formContext={formContext}
            formData={formData}
            isSubmitting={submitState === RequestStates.PENDING}
            onChange={this.handleChange}
            onSubmit={this.handleSubmit}
            schema={schema}
            uiSchema={uiSchema} />
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  entityIndexToIdMap: state.getIn(['profile', 'basicInformation', 'address', 'entityIndexToIdMap'], Map()),
  entitySetIds: state.getIn(['app', 'selectedOrgEntitySetIds'], Map()),
  fetchState: state.getIn(['profile', 'basicInformation', 'address', 'fetchState'], RequestStates.STANDBY),
  formData: state.getIn(['profile', 'basicInformation', 'address', 'formData'], Map()),
  propertyTypeIds: state.getIn(['edm', 'fqnToIdMap'], Map()),
  submitState: state.getIn(['profile', 'basicInformation', 'address', 'submitState'], RequestStates.STANDBY),
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    updateAddress,
    submitAddress,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(AddressForm);
