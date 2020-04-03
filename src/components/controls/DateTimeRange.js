/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { DateTimePicker, Label } from 'lattice-ui-kit';

type Props = {
  startDate :?string,
  endDate :?string,
  onStartChange :(start :string) => void,
  onEndChange :(end :string) => void,
  label? :string
};

const WideWrapper = styled.div`
  width: 100%;
`;

const DatePickerTitle = styled.div`
  font-size: 16px;
  margin: 28px 0 20px 0;
  text-align: center;
  color: #555e6f;
  font-weight: 600;
`;

const DateRangeContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const DatePickerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
`;


const DateTimeRange = ({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
  label
} :Props) => (
  <WideWrapper>
    <DatePickerTitle>{label}</DatePickerTitle>
    <DateRangeContainer>
      <DatePickerWrapper>
        <Label>Start Date</Label>
        <DateTimePicker
            onChange={onStartChange}
            value={startDate} />
      </DatePickerWrapper>
      <DatePickerWrapper>
        <Label>End Date</Label>
        <DateTimePicker
            onChange={onEndChange}
            value={endDate} />
      </DatePickerWrapper>
    </DateRangeContainer>
  </WideWrapper>
);

DateTimeRange.defaultProps = {
  label: 'Choose a date range.'
};

export default DateTimeRange;
