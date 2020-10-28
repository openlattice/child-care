/*
 * @flow
 */
import React from 'react';
import styled from 'styled-components';
import { Checkbox } from 'lattice-ui-kit';

import { ContentOuterWrapper } from '../../../../components/layout';
import { FACILITY_TYPES } from '../../../../utils/DataConstants';
import { LABELS, FACILITY_TYPE_LABELS } from '../../../../utils/constants/Labels';

const Instruction = styled.div`
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: normal;
  line-height: 19px;
`;

type Props = {
  onChange :(nextValues :string[]) => void;
  renderText :(labels :Object) => string;
  setIsValid :(isValid :boolean) => void;
  value :string[];
};

export default class TypeOfCareFilter extends React.Component<Props> {

  componentDidMount() {
    const { setIsValid } = this.props;
    setIsValid(true);
  }

  render() {

    const { value, onChange, renderText } = this.props;

    const onCheckboxChange = (e) => {
      const { value: newValue } = e.target;

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
          <Checkbox
              mode="button"
              label={renderText(FACILITY_TYPE_LABELS[facilityType])}
              value={facilityType}
              checked={value.includes(facilityType)}
              onChange={onCheckboxChange} />
        ))}
      </ContentOuterWrapper>
    );
  }
}
