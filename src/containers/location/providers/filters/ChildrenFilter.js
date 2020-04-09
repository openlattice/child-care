import React from 'react';
import styled from 'styled-components';

import PlusMinus from '../../../../components/controls/PlusMinus';
import { PROPERTY_TYPES } from '../../../../utils/constants/DataModelConstants';
import { LABELS } from '../../../../utils/constants/Labels';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Label = styled.div`
  margin: 30px 0 20px 0;
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 19px;
  text-align: center;

  color: #555E6F;
`;

const ChildrenFilter = ({ value, onChange, renderText }) => {

  const renderPlusMinus = (field) => (
    <PlusMinus value={value.get(field, 0)} onChange={newValue => onChange(value.set(field, newValue))} />
  );

  return (
    <Wrapper>

      <Label>{renderText(LABELS.AGE_INFANT)}</Label>
      {renderPlusMinus(PROPERTY_TYPES.CAPACITY_UNDER_2)}

      <Label>{renderText(LABELS.AGE_TODDLER)}</Label>
      {renderPlusMinus(PROPERTY_TYPES.CAPACITY_2_to_5)}

      <Label>{renderText(LABELS.AGE_SCHOOL)}</Label>
      {renderPlusMinus(PROPERTY_TYPES.CAPACITY_OVER_5)}

    </Wrapper>
  );

};

export default ChildrenFilter;
