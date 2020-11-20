// @flow

import React from 'react';

import { useSelector } from 'react-redux';

import { getTextFnFromState } from '../../../utils/AppUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { LABELS } from '../../../utils/constants/labels';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
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
      <span>{getText(LABELS.CAPACITY)}</span>
      <span>{`${capacity} ${getText(capacityLabel)}`}</span>
    </TitleRow>
  );
};

export default VacancySection;
