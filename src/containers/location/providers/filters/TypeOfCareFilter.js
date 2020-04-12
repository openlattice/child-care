import React from 'react';
import styled from 'styled-components';

import CheckboxButton from '../../../../components/controls/CheckboxButton';
import { ContentOuterWrapper } from '../../../../components/layout';
import { FACILITY_TYPES } from '../../../../utils/DataConstants';
import { LABELS, FACILITY_TYPE_LABELS } from '../../../../utils/constants/Labels';

const Instruction = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 19px;
`;

export default class TypeOfCareFilter extends React.Component {

  componentDidMount() {
    const { setIsValid } = this.props;
    setIsValid(true);
  }

  render() {

    const { value, onChange, renderText } = this.props;

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
        {Object.values(FACILITY_TYPES).map((facilityType) => (
          <CheckboxButton
              marginTop="20px"
              key={facilityType}
              label={renderText(FACILITY_TYPE_LABELS[facilityType])}
              value={facilityType}
              isSelected={value.includes(facilityType)}
              onChange={onCheckboxChange} />
        ))}
      </ContentOuterWrapper>
    );
  }

};
