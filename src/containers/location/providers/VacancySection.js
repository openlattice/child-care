// @flow

import React from 'react';

import { DataUtils, DateTimeUtils } from 'lattice-utils';
import { useSelector } from 'react-redux';

import { getTextFnFromState } from '../../../utils/AppUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { LABELS } from '../../../utils/constants/Labels';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { FlexContainer, MarginWrapper, TitleRow } from '../../styled';

const { LOCATIONS } = STATE;
const { SELECTED_PROVIDER } = PROVIDERS;

const { getPropertyValue } = DataUtils;
const { formatAsDate } = DateTimeUtils;

const VacancySection = () => {
  const getText = useSelector(getTextFnFromState);
  const provider = useSelector((store) => store.getIn([LOCATIONS, SELECTED_PROVIDER]));

  const hasVacancies = getPropertyValue(provider, [PROPERTY_TYPES.VACANCIES, 0]);
  const vacancyLastUpdateDate :string = getPropertyValue(provider, [PROPERTY_TYPES.VACANCY_LAST_UPDATED, 0]);
  const formatedVacancyLastUpdated = formatAsDate(vacancyLastUpdateDate, '');

  let label = LABELS.UNKNOWN;
  if (hasVacancies !== '') {
    label = hasVacancies ? LABELS.SPOTS_OPEN : LABELS.BOOKED;
  }

  return (
    <TitleRow>
      <FlexContainer>
        <span>{getText(LABELS.AVAILABILITY)}</span>
        {
          vacancyLastUpdateDate
            && <MarginWrapper>{`${getText(LABELS.AS_OF)} ${formatedVacancyLastUpdated}`}</MarginWrapper>
        }
      </FlexContainer>
      <span>{getText(label)}</span>
    </TitleRow>
  );
};

export default VacancySection;
