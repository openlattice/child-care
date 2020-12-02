// @flow

import React from 'react';

import { Typography } from 'lattice-ui-kit';
import { DataUtils, DateTimeUtils } from 'lattice-utils';
import { useSelector } from 'react-redux';

import { Body3 } from '../../../components/layout';
import { getTextFnFromState } from '../../../utils/AppUtils';
import { PROPERTY_TYPES } from '../../../utils/constants/DataModelConstants';
import { PROVIDERS, STATE } from '../../../utils/constants/StateConstants';
import { LABELS } from '../../../utils/constants/labels';
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
        <Typography variant="subtitle2">{getText(LABELS.AVAILABILITY)}</Typography>
        {
          vacancyLastUpdateDate && (
            <MarginWrapper>{`${getText(LABELS.AS_OF)} ${formatedVacancyLastUpdated}`}</MarginWrapper>
          )
        }
      </FlexContainer>
      <Body3>{getText(label)}</Body3>
    </TitleRow>
  );
};

export default VacancySection;
