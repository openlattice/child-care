// @flow
import React, { Component } from 'react';
import styled from 'styled-components';
import { DateTime } from 'luxon';
import { Form, DataProcessingUtils } from 'lattice-fabricate';
import {
  Card,
  CardHeader,
  CardSegment,
  Spinner
} from 'lattice-ui-kit';
import { Map, getIn } from 'immutable';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { Dispatch } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import Portrait from '../../../../components/portrait/Portrait';
import { updatePhoto, submitPhotos } from './actions/PhotosActions';
import { removeDataUriPrefix, getImageDataFromEntity } from '../../../../utils/BinaryUtils';
import { schema, uiSchema } from './schemas/PhotosSchemas';
import { COMPLETED_DT_FQN, IMAGE_DATA_FQN } from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';
import { reduceRequestStates } from '../../../../utils/StateUtils';

const {
  IMAGE_FQN,
  IS_PICTURE_OF_FQN,
  PEOPLE_FQN,
} = APP_TYPES_FQNS;

const {
  VALUE_MAPPERS,
  findEntityAddressKeyFromMap,
  getEntityAddressKey,
  getPageSectionKey,
  parseIdSchemaPath,
  processAssociationEntityData,
  processEntityData,
  processEntityDataForPartialReplace,
  replaceEntityAddressKeys,
} = DataProcessingUtils;

const imageValueMapper = (value :any, contentType :string = 'image/png') => ({
  data: removeDataUriPrefix(value),
  'content-type': contentType,
});

const mappers = {
  [VALUE_MAPPERS]: {
    [getEntityAddressKey(0, IMAGE_FQN, IMAGE_DATA_FQN)]: imageValueMapper
  }
};

const PortraitWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 30px 30px 0 30px;
`;

type Props = {
  actions :{
    submitPhotos :RequestSequence;
    updatePhoto :RequestSequence;
  },
  entityIndexToIdMap :Map;
  entitySetIds :Map;
  fetchState :RequestState;
  imageUrl :string;
  personEKID :UUID;
  propertyTypeIds :Map;
  upsertState :RequestState;
};

type State = {
  formData :Object;
};

class AddressForm extends Component<Props, State> {

  state = {
    formData: {}
  }

  getAssociations = () => {
    const { personEKID } = this.props;
    const nowAsIsoString :string = DateTime.local().toISO();
    return [
      [IS_PICTURE_OF_FQN, 0, IMAGE_FQN, personEKID, PEOPLE_FQN, {
        [COMPLETED_DT_FQN.toString()]: [nowAsIsoString]
      }],
    ];
  }

  handleSubmit = ({ formData } :Object) => {
    const {
      actions,
      entitySetIds,
      propertyTypeIds,
    } = this.props;

    const entityData = processEntityData(formData, entitySetIds, propertyTypeIds, mappers);
    const associationEntityData = processAssociationEntityData(
      this.getAssociations(),
      entitySetIds,
      propertyTypeIds
    );

    actions.submitPhotos({
      associationEntityData,
      entityData,
      path: [],
      properties: formData
    });
  }

  handleUpdate = ({ formData, idSchema } :Object) => {
    const {
      actions,
      entityIndexToIdMap,
      entitySetIds,
      propertyTypeIds
    } = this.props;

    const path = parseIdSchemaPath(idSchema);

    // replace address keys with entityKeyId
    const draftWithKeys = replaceEntityAddressKeys(
      formData,
      findEntityAddressKeyFromMap(entityIndexToIdMap)
    );

    const mappersWithKeys = replaceEntityAddressKeys(
      mappers,
      findEntityAddressKeyFromMap(entityIndexToIdMap)
    );

    // process for partial replace
    const editedEntityData = processEntityDataForPartialReplace(
      draftWithKeys,
      {},
      entitySetIds,
      propertyTypeIds,
      mappersWithKeys
    );

    actions.updatePhoto({
      entityData: editedEntityData,
      formData,
      path,
      properties: formData
    });
  }

  handleOnChange = ({ formData } :any) => {
    this.setState({ formData });
  }

  render() {
    const {
      entityIndexToIdMap,
      fetchState,
      imageUrl,
      upsertState,
    } = this.props;
    const { formData } = this.state;

    const previewImageURL = getIn(formData,
      [
        getPageSectionKey(1, 1),
        getEntityAddressKey(0, IMAGE_FQN, IMAGE_DATA_FQN)
      ]) || imageUrl;

    if (fetchState === RequestStates.PENDING) {
      return (
        <Card>
          <CardSegment vertical>
            <Spinner size="2x" />
          </CardSegment>
        </Card>
      );
    }

    let submitAction = this.handleSubmit;
    if (!entityIndexToIdMap.isEmpty()) {
      submitAction = this.handleUpdate;
    }

    return (
      <Card>
        <CardHeader mode="primary" padding="sm">
          Profile Picture
        </CardHeader>
        <PortraitWrapper>
          <Portrait imageUrl={previewImageURL} />
        </PortraitWrapper>
        <Form
            isSubmitting={upsertState === RequestStates.PENDING}
            formData={formData}
            schema={schema}
            onChange={this.handleOnChange}
            uiSchema={uiSchema}
            onSubmit={submitAction} />
      </Card>
    );
  }
}

const mapStateToProps = (state) => {

  const imageEntity = state.getIn(['profile', 'basicInformation', 'photos', 'data'], Map());
  const imageUrl = getImageDataFromEntity(imageEntity);

  const upsertState = reduceRequestStates([
    state.getIn(['profile', 'basicInformation', 'photos', 'updateState']),
    state.getIn(['profile', 'basicInformation', 'photos', 'submitState']),
  ]);

  return {
    entityIndexToIdMap: state.getIn(['profile', 'basicInformation', 'photos', 'entityIndexToIdMap'], Map()),
    entitySetIds: state.getIn(['app', 'selectedOrgEntitySetIds'], Map()),
    fetchState: state.getIn(['profile', 'basicInformation', 'photos', 'fetchState'], RequestStates.STANDBY),
    formData: state.getIn(['profile', 'basicInformation', 'photos', 'formData'], Map()),
    imageUrl,
    upsertState,
    propertyTypeIds: state.getIn(['edm', 'fqnToIdMap'], Map()),
  };
};

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    updatePhoto,
    submitPhotos,
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(AddressForm);
