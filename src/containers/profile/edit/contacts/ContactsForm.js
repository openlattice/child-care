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
import { List, Map, get } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
import type { Match } from 'react-router';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import {
  getContacts,
  deleteContact,
  submitContacts,
  updateContact,
} from './ContactsActions';
import { schema, uiSchema } from './schemas/ContactsSchemas';
import { PROFILE_ID_PARAM } from '../../../../core/router/Routes';
import { removeRelationshipData, getContactAssociations } from './ContactsUtils';

const {
  getPageSectionKey,
  processAssociationEntityData,
  processEntityData,
} = DataProcessingUtils;

type Props = {
  actions :{
    getContacts :RequestSequence;
    deleteContact :RequestSequence;
    submitContacts :RequestSequence;
    updateContact :RequestSequence;
  },
  entityIndexToIdMap :Map;
  entitySetIds :Map;
  fetchState :RequestState;
  formData :Map;
  match :Match;
  propertyTypeIds :Map;
  submitState :RequestState;
};

type State = {
  formData :Object;
  prepopulated :boolean;
};

class ContactsForm extends Component<Props, State> {

  state = {
    formData: {},
    prepopulated: false
  }

  componentDidMount() {
    const {
      actions,
      match,
    } = this.props;
    const personEKID = match.params[PROFILE_ID_PARAM];
    actions.getContacts(personEKID);
    this.initializeFormData();
  }

  componentDidUpdate(prevProps :Props) {
    const {
      actions,
      formData,
      match,
    } = this.props;
    const {
      formData: prevFormData,
      match: prevMatch,
    } = prevProps;
    const personEKID = match.params[PROFILE_ID_PARAM];
    const prevPersonEKID = prevMatch.params[PROFILE_ID_PARAM];
    if (personEKID !== prevPersonEKID) {
      actions.getContacts(personEKID);
    }

    if (!formData.equals(prevFormData)) {
      this.initializeFormData();
    }
  }

  initializeFormData = () => {
    const { formData } = this.props;
    this.setState({
      formData: formData.toJS(),
      prepopulated: !get(formData, getPageSectionKey(1, 1), List()).isEmpty()
    });
  }

  getAssociations = (formData :Object) => {
    const { match } = this.props;
    const personEKID = match.params[PROFILE_ID_PARAM];
    const nowAsIsoString :string = DateTime.local().toISO();
    return [
      ...getContactAssociations(
        formData,
        nowAsIsoString,
        personEKID
      )
    ];
  }

  // process associations before removing them from being processed as a regular entity
  handleSubmit = ({
    formData,
    path = [],
    properties
  } :Object) => {
    const { actions, entitySetIds, propertyTypeIds } = this.props;
    const associationEntityData = processAssociationEntityData(
      this.getAssociations(formData),
      entitySetIds,
      propertyTypeIds
    );

    const withoutRelationships = removeRelationshipData(formData);
    const entityData = processEntityData(withoutRelationships, entitySetIds, propertyTypeIds);

    actions.submitContacts({
      associationEntityData,
      entityData,
      path,
      properties: properties || formData
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
      addActions: {
        addContact: this.handleSubmit
      },
      deleteAction: actions.deleteContact,
      editAction: actions.updateContact,
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
          Emergency Contacts
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
  entityIndexToIdMap: state.getIn(['profile', 'contacts', 'entityIndexToIdMap'], Map()),
  entitySetIds: state.getIn(['app', 'selectedOrgEntitySetIds'], Map()),
  fetchState: state.getIn(['profile', 'contacts', 'fetchState'], RequestStates.STANDBY),
  formData: state.getIn(['profile', 'contacts', 'formData'], Map()),
  propertyTypeIds: state.getIn(['edm', 'fqnToIdMap'], Map()),
  submitState: state.getIn(['profile', 'contacts', 'submitState'], RequestStates.STANDBY),
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    getContacts,
    deleteContact,
    submitContacts,
    updateContact,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(ContactsForm);
