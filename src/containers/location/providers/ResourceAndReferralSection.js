// @flow

import React from 'react';

import { List, Map } from 'immutable';
import { Button } from 'lattice-ui-kit';
import { DataUtils } from 'lattice-utils';
import { useDispatch, useSelector } from 'react-redux';

import ExpandableSection from './ExpandableSection';

import { Body3 } from '../../../components/layout';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { LABELS } from '../../../utils/constants/labels';
import { Row } from '../../styled';
import { selectReferralAgency } from '../LocationsActions';

const { LOCATIONS } = STATE;
const { SELECTED_PROVIDER, RRS_BY_ID } = PROVIDERS;

const { getEntityKeyId, getPropertyValue } = DataUtils;

const ResourceAndReferralSection = () => {
  const dispatch = useDispatch();
  const getText = useSelector(getTextFnFromState);
  const provider = useSelector((store) => store.getIn([LOCATIONS, SELECTED_PROVIDER]));
  const selectedProviderId = getEntityKeyId(provider);
  const rrs = useSelector((store) => store.getIn([LOCATIONS, RRS_BY_ID, selectedProviderId], List()))
    .map((entity) => entity.get('neighborDetails', Map()));

  const renderRR = (rr :Map) => {
    // const dispatch = useDispatch();
    const name = getPropertyValue(rr, [PROPERTY_TYPES.FACILITY_NAME, 0]);

    const handleViewProfile = () => {
      dispatch(selectReferralAgency(rr));
    };

    return (
      <Row key={getEntityKeyId(rr)}>
        <Button color="primary" onClick={handleViewProfile} size="small" variant="text">{name}</Button>
      </Row>
    );
  };

  return (
    <ExpandableSection title={getText(LABELS.RESOURCE_AND_REFERRAL)}>
      <Body3>{getText(LABELS.RESOURCE_AND_REFERRAL_DESCRIPTION)}</Body3>
      {rrs.map(renderRR)}
    </ExpandableSection>
  );
};

export default ResourceAndReferralSection;
