/*
 * @flow
 */
import React from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import { Colors } from 'lattice-ui-kit';

import PlusMinus from '../../../../components/controls/PlusMinus';
import { PROPERTY_TYPES } from '../../../../utils/constants/DataModelConstants';
import { LABELS } from '../../../../utils/constants/labels';
import type { Translation } from '../../../../types';

const { NEUTRAL } = Colors;

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Label = styled.div`
  color: ${NEUTRAL.N700};
  font-size: 16px;
  font-style: normal;
  font-weight: normal;
  line-height: 19px;
  margin: 30px 0 20px 0;
  text-align: center;
`;

type Props = {
  onChange :(nextValues :Map) => void;
  setIsValid :(isValid :boolean) => void;
  getText :(translation :Translation) => string;
  value :Map;
}

export default class ChildrenFilter extends React.Component<Props> {

  componentDidMount() {
    const { setIsValid } = this.props;
    setIsValid(true);
  }

  render() {
    const { value, onChange, getText } = this.props;

    const renderPlusMinus = (field) => (
      <PlusMinus value={value.get(field, 0)} onChange={(newValue) => onChange(value.set(field, newValue))} />
    );

    return (
      <Wrapper>

        <Label id="numberOfInfants">{getText(LABELS.AGE_INFANT)}</Label>
        {renderPlusMinus(PROPERTY_TYPES.CAPACITY_UNDER_2)}

        <Label id="numberOfChildren">{getText(LABELS.AGE_SCHOOL)}</Label>
        {renderPlusMinus(PROPERTY_TYPES.CAPACITY_OVER_5)}

      </Wrapper>
    );
  }

}
