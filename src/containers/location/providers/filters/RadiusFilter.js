import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';

import { selectStyles } from '../../../app/SelectStyles';
import { isMobile } from '../../../../utils/AppUtils';

const RADIUS_OPTIONS = [
  1,
  5,
  10,
  25,
  50
].map(value => ({
  value,
  label: `${value} mile${value === 1 ? '' : 's'}`
}));

const BasicSelect = styled.select`
  background-color: #f9f9fd;
  border: solid 1px #dcdce7;
  borderRadius: 3px;
  box-shadow: none;
  font-size: 12px;
  line-height: normal;
  min-height: 30px;
  text-align: center;

  &:focus {
    background-color: white;
    border: solid 1px #6124e2;
  }
`;


const RadiusFilter = ({ value, onChange }) => {

  const handleOnChange = ({ value }) => {
    onChange(value);
  }

  const onBasicSelectChange = ({ target }) => {
    const { selectedIndex } = target;
    handleOnChange(RADIUS_OPTIONS[selectedIndex]);
  }

  const selectedOption = RADIUS_OPTIONS.find(option => option.value === value);

  const renderVal = (val) => `${val} mile${val === 1 ? '' : 's'}`;

  if (isMobile()) {
    return (
      <BasicSelect value={selectedOption.value} onChange={onBasicSelectChange}>
        {RADIUS_OPTIONS.map(({ label, value }) => (
          <option key={value} label={label} value={value}>
            {renderVal(value)}
          </option>
        ))}
      </BasicSelect>
    )
  }

  return (
    <Select
        autoFocus
        value={selectedOption}
        isClearable={false}
        isSearchable={false}
        isMulti={false}
        onChange={handleOnChange}
        options={RADIUS_OPTIONS}
        placeholder="Select..."
        styles={selectStyles} />
  );

}

export default RadiusFilter;
