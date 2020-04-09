import React from 'react';
import styled from 'styled-components';

import CheckboxButton from '../../../../components/controls/CheckboxButton';
import { ContentOuterWrapper } from '../../../../components/layout';
import { FACILITY_TYPES } from '../../../../utils/DataConstants';
import { LABELS } from '../../../../utils/constants/Labels';

const Instruction = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 19px;
`;

const TypeOfCareFilter = ({ value, onChange, renderText }) => {

  const onCheckboxChange = (newValue) => {

    if (value.includes(newValue)) {
      onChange(value.filter((v) => v !== newValue));
    }
    else {
      onChange(value.push(newValue));
    }
  };

  return (
    <ContentOuterWrapper>
      <Instruction>{renderText(LABELS.SELECT_ALL)}</Instruction>
      {FACILITY_TYPES.map((facilityType) => (
        <CheckboxButton
            marginTop="20px"
            key={facilityType}
            label={facilityType}
            value={facilityType}
            isSelected={value.includes(facilityType)}
            onChange={onCheckboxChange} />
      ))}
    </ContentOuterWrapper>
  );

};

export default TypeOfCareFilter;
