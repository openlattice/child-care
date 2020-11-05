/*
 * @flow
 */
import React from 'react';

import styled from 'styled-components';
import { Checkbox } from 'lattice-ui-kit';

import { ContentOuterWrapper } from '../../../../components/layout';
import { FACILITY_TYPES } from '../../../../utils/DataConstants';
import { FACILITY_TYPE_LABELS, LABELS } from '../../../../utils/constants/Labels';
import type { Translation } from '../../../../types';

const Instruction = styled.div`
  font-size: 14px;
  font-style: normal;
  font-weight: normal;
  line-height: 19px;
`;

type Props = {
  onChange :(nextValues :string[]) => void;
  getText :(translation :Translation) => string;
  setIsValid :(isValid :boolean) => void;
  value :string[];
};

export default class TypeOfCareFilter extends React.Component<Props> {

  componentDidMount() {
    const { setIsValid } = this.props;
    setIsValid(true);
  }

  render() {

    const { value, onChange, getText } = this.props;

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
        <Instruction>{getText(LABELS.SELECT_ALL)}</Instruction>
        {Object.values(FACILITY_TYPES).map((facilityType) => (
          <Checkbox
              checked={value.includes(facilityType)}
              label={getText(FACILITY_TYPE_LABELS[facilityType])}
              mode="button"
              onChange={onCheckboxChange}
              value={facilityType} />
        ))}
      </ContentOuterWrapper>
    );
  }
}
