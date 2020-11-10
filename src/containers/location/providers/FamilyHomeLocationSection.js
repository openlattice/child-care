// @flow

import React from 'react';

import { useSelector } from 'react-redux';

import { getTextFnFromState } from '../../../utils/AppUtils';
import { shouldHideLocation } from '../../../utils/DataUtils';
import { LABELS } from '../../../utils/constants/Labels';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { InfoText, TitleRow } from '../../styled';

const { LOCATIONS } = STATE;
const { SELECTED_PROVIDER } = PROVIDERS;

const VacancySection = () => {
  const getText = useSelector(getTextFnFromState);
  const provider = useSelector((store) => store.getIn([LOCATIONS, SELECTED_PROVIDER]));

  if (!shouldHideLocation(provider)) {
    return null;
  }

  return (
    <TitleRow>
      <InfoText>{getText(LABELS.CONTACT_RR_FOR_INFO)}</InfoText>
    </TitleRow>
  );
};

export default VacancySection;
