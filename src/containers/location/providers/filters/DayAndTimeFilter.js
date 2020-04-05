import React from 'react';
import styled from 'styled-components';


import TimePicker from '../../../../components/controls/TimePicker';
import StyledCheckbox from '../../../../components/controls/StyledCheckbox';
import { DAYS_OF_WEEK } from '../../../../utils/DataConstants';

const LABELS = {
  [DAYS_OF_WEEK.SUNDAY]: 'Sunday',
  [DAYS_OF_WEEK.MONDAY]: 'Monday',
  [DAYS_OF_WEEK.TUESDAY]: 'Tuesday',
  [DAYS_OF_WEEK.WEDNESDAY]: 'Wednesday',
  [DAYS_OF_WEEK.THURSDAY]: 'Thursday',
  [DAYS_OF_WEEK.FRIDAY]: 'Friday',
  [DAYS_OF_WEEK.SATURDAY]: 'Saturday'
}

const Row = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 17px;

  color: #555E6F;
`;

const SectionWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const Spacer = styled.div`
  width: 5px;
`;

const DayAndTimeFilter = ({ value, onChange }) => {

  const renderRow = (day) => {

    const isSelected = value.has(day);
    const start = value.getIn([day, 0]);
    const end = value.getIn([day, 1]);

    const onTimeChange = (time, index) => {
      const arr = [start, end];
      arr[index] = time;
      console.log(value.set(day, arr).toJS())
      onChange(value.set(day, arr));
    };

    const onCheckboxChange = () => {
      if (isSelected) {
        onChange(value.delete(day));
      }
      else {
        onChange(value.set(day, [undefined, undefined]));
      }
    }

    return (
      <Row key={day}>
        <SectionWrapper>
          <StyledCheckbox checked={isSelected} onChange={onCheckboxChange} name={day} noMargin />
          <span>{LABELS[day]}</span>
        </SectionWrapper>
        <SectionWrapper>
          <TimePicker
              fullWidth={false}
              value={start}
              onChange={(time) => onTimeChange(time, 0)} />
          <Spacer />
          <TimePicker
              fullWidth={false}
              value={end}
              onChange={(time) => onTimeChange(time, 1)} />
        </SectionWrapper>
      </Row>
    )
  }

  return Object.values(DAYS_OF_WEEK).map(renderRow);

}

export default DayAndTimeFilter;
