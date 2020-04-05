import React from 'react';
import styled from 'styled-components';

import CheckboxButton from '../../../../components/controls/CheckboxButton';
import { ContentOuterWrapper } from '../../../../components/layout';
import { FACILITY_TYPES } from '../../../../utils/DataConstants';

const Instruction = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 19px;
`;

const TypeOfCareFilter = ({ value, onChange }) => {

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
      <Instruction>Select all that apply:</Instruction>
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
