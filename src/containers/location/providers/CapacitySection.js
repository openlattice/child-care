// @flow

import React from 'react';

import { Typography } from 'lattice-ui-kit';
import { useSelector } from 'react-redux';

import { Body3 } from '../../../components/layout';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { LABELS } from '../../../utils/constants/labels';
import { TitleRow } from '../../styled';

const { LOCATIONS } = STATE;
const { SELECTED_PROVIDER } = PROVIDERS;

const CAPACITY_PROPERTY_TYPES = [
  PROPERTY_TYPES.CAPACITY_UNDER_2,
  PROPERTY_TYPES.CAPACITY_2_TO_5,
  PROPERTY_TYPES.CAPACITY_OVER_5,
  PROPERTY_TYPES.CAPACITY_AGE_UNKNOWN
];

const VacancySection = () => {
  const getText = useSelector(getTextFnFromState);
  const provider = useSelector((store) => store.getIn([LOCATIONS, SELECTED_PROVIDER]));

  let capacity = 0;
  CAPACITY_PROPERTY_TYPES.forEach((capacityFqn) => {
    capacity += provider.getIn([capacityFqn, 0], 0);
  });
  const capacityLabel = capacity === 1 ? LABELS.CHILD : LABELS.CHILDREN;

  return (
    <TitleRow>
      <Typography textPrimary variant="subtitle2">{getText(LABELS.CAPACITY)}</Typography>
      <Body3>{`${capacity} ${getText(capacityLabel)}`}</Body3>
    </TitleRow>
  );
};

export default VacancySection;
