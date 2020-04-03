// @flow

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react';
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

import { useFormData } from '../../../../components/hooks';
import { schema, uiSchema } from './schemas/ScarsMarksTattoosSchemas';
import { submitScarsMarksTattoos, updateScarsMarksTattoos } from './actions/ScarsMarksTattoosActions';

import { COMPLETED_DT_FQN } from '../../../../edm/DataModelFqns';
import { APP_TYPES_FQNS } from '../../../../shared/Consts';

const {
  IDENTIFYING_CHARACTERISTICS_FQN,
  OBSERVED_IN_FQN,
  PEOPLE_FQN,
} = APP_TYPES_FQNS;

const {
  processEntityData,
  processAssociationEntityData
} = DataProcessingUtils;

type Props = {
  actions :{
    submitScarsMarksTattoos :RequestSequence;
    updateScarsMarksTattoos :RequestSequence;
  };
  entityIndexToIdMap :Map;
  entitySetIds :Map;
  fetchState :RequestState;
  personEKID :string;
  propertyTypeIds :Map;
  scarsFormData :Map;
  submitState :RequestState;
};

const ScarsForm = (props :Props) => {
  const {
    actions,
    entityIndexToIdMap,
    entitySetIds,
    fetchState,
    personEKID,
    propertyTypeIds,
    scarsFormData,
    submitState,
  } = props;

  const [formData, setFormData] = useFormData(scarsFormData);
  const [prepopulated, setPrepopulated] = useState(false);

  useEffect(() => {
    if (!entityIndexToIdMap.isEmpty()) {
      setPrepopulated(true);
    }
  }, [entityIndexToIdMap, setPrepopulated]);

  const formContext = useMemo(() => ({
    editAction: actions.updateScarsMarksTattoos,
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

  const handleSubmit = useCallback((payload :any) => {
    const { formData: newFormData } = payload;
    const nowAsIsoString :string = DateTime.local().toISO();

    const associations = [
      [OBSERVED_IN_FQN, 0, IDENTIFYING_CHARACTERISTICS_FQN, personEKID, PEOPLE_FQN, {
        [COMPLETED_DT_FQN]: [nowAsIsoString]
      }]
    ];

    const entityData = processEntityData(newFormData, entitySetIds, propertyTypeIds);
    const associationEntityData = processAssociationEntityData(
      associations,
      entitySetIds,
      propertyTypeIds
    );

    actions.submitScarsMarksTattoos({
      associationEntityData,
      entityData,
      path: [],
      properties: newFormData
    });
  }, [
    actions,
    entitySetIds,
    personEKID,
    propertyTypeIds,
  ]);

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
        Scars, Marks, & Tattoos
      </CardHeader>
      <Form
          disabled={prepopulated}
          formContext={formContext}
          formData={formData}
          isSubmitting={submitState === RequestStates.PENDING}
          onSubmit={handleSubmit}
          onChange={setFormData}
          schema={schema}
          uiSchema={uiSchema} />
    </Card>
  );
};

const mapStateToProps = (state :Map) => ({
  entityIndexToIdMap: state.getIn(['profile', 'basicInformation', 'scars', 'entityIndexToIdMap'], Map()),
  entitySetIds: state.getIn(['app', 'selectedOrgEntitySetIds'], Map()),
  fetchState: state.getIn(['profile', 'basicInformation', 'scars', 'fetchState'], RequestStates.STANDBY),
  propertyTypeIds: state.getIn(['edm', 'fqnToIdMap'], Map()),
  scarsFormData: state.getIn(['profile', 'basicInformation', 'scars', 'formData'], Map()),
  submitState: state.getIn(['profile', 'basicInformation', 'scars', 'submitState'], RequestStates.STANDBY),
});

const mapDispatchToProps = (dispatch :Dispatch<any>) => ({
  actions: bindActionCreators({
    submitScarsMarksTattoos,
    updateScarsMarksTattoos
  }, dispatch)
});

// $FlowFixMe
export default connect(mapStateToProps, mapDispatchToProps)(ScarsForm);
