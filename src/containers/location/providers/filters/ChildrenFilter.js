import React from 'react';
import styled from 'styled-components';

import PlusMinus from '../../../../components/controls/PlusMinus';
import { PROPERTY_TYPES } from '../../../../utils/constants/DataModelConstants';

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

const ChildrenFilter = ({ value, onChange }) => {

  const onValueChange = (field, newValue) => {
    return onChange(value.set(field, newValue));
  }

  const renderPlusMinus = (field) => (
    <PlusMinus value={value.get(field, 0)} onChange={newValue => onChange(value.set(field, newValue))} />
  );

  return (
    <Wrapper>

    <Label>Infant (0 - 2 yrs)</Label>
    {renderPlusMinus(PROPERTY_TYPES.CAPACITY_UNDER_2)}

    <Label>Toddler (2 - 5 yrs)</Label>
    {renderPlusMinus(PROPERTY_TYPES.CAPACITY_2_to_5)}

    <Label>School age (6+ yrs)</Label>
    {renderPlusMinus(PROPERTY_TYPES.CAPACITY_OVER_5)}

    </Wrapper>
  );

}

export default ChildrenFilter;
