import React from 'react';
import Select from 'react-select';
import styled from 'styled-components';

import { selectStyles } from '../../../app/SelectStyles';

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


const RadiusFilter = ({ value, onChange }) => {

  const handleOnChange = ({ value }) => {
    onChange(value);
  }

  return (
    <Select
        value={RADIUS_OPTIONS.find(option => option.value === value)}
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
