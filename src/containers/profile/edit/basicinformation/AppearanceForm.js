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
  updateAppearance,
  submitAppearance
} from './actions/BasicInformationActions';
import { schema, uiSchema } from './schemas/AppearanceSchemas';
import { COMPLETED_DT_FQN } from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';

const {
  OBSERVED_IN_FQN,
  PEOPLE_FQN,
  PHYSICAL_APPEARANCE_FQN,
} = APP_TYPES_FQNS;

const {
  processEntityData,
  processAssociationEntityData
} = DataProcessingUtils;

type Props = {
  actions :{
    submitAppearance :RequestSequence;
    updateAppearance :RequestSequence;
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

class AppearanceForm extends Component<Props, State> {

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
      [OBSERVED_IN_FQN, 0, PHYSICAL_APPEARANCE_FQN, personEKID, PEOPLE_FQN, {
        [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
      }]
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

    actions.submitAppearance({
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
      submitState
    } = this.props;
    const { formData, prepopulated } = this.state;
    const formContext = {
      editAction: actions.updateAppearance,
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
          Appearance
        </CardHeader>
        <Form
            isSubmitting={submitState === RequestStates.PENDING}
            formData={formData}
            disabled={prepopulated}
            schema={schema}
            onChange={this.handleChange}
            uiSchema={uiSchema}
            onSubmit={this.handleSubmit}
            formContext={formContext} />
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({
  entityIndexToIdMap: state.getIn(['profile', 'basicInformation', 'appearance', 'entityIndexToIdMap'], Map()),
  entitySetIds: state.getIn(['app', 'selectedOrgEntitySetIds'], Map()),
  fetchState: state.getIn(['profile', 'basicInformation', 'appearance', 'fetchState'], RequestStates.STANDBY),
  submitState: state.getIn(['profile', 'basicInformation', 'appearance', 'submitState'], RequestStates.STANDBY),
  formData: state.getIn(['profile', 'basicInformation', 'appearance', 'formData'], Map()),
  propertyTypeIds: state.getIn(['edm', 'fqnToIdMap'], Map()),
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    updateAppearance,
    submitAppearance,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(AppearanceForm);
