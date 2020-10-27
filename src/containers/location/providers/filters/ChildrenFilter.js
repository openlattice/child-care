/*
 * @flow
 */
import React from 'react';
import styled from 'styled-components';
import { Map } from 'immutable';
import { Colors } from 'lattice-ui-kit';

import PlusMinus from '../../../../components/controls/PlusMinus';
import { PROPERTY_TYPES } from '../../../../utils/constants/DataModelConstants';
import { LABELS } from '../../../../utils/constants/Labels';

const { NEUTRAL } = Colors;

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

  color: ${NEUTRAL.N700};
`;

type Props = {
  setIsValid :(isValid :boolean) => void;
  value :Map;
  onChange :(nextValues :Map) => void;
  renderText :(labels :Object) => string;
}

export default class ChildrenFilter extends React.Component<Props> {

  componentDidMount() {
    const { setIsValid } = this.props;
    setIsValid(true);
  }

  render() {
    const { value, onChange, renderText } = this.props;

    const renderPlusMinus = (field) => (
      <PlusMinus value={value.get(field, 0)} onChange={(newValue) => onChange(value.set(field, newValue))} />
    );

    return (
      <Wrapper>

        <Label id="numberOfInfants">{renderText(LABELS.AGE_INFANT)}</Label>
        {renderPlusMinus(PROPERTY_TYPES.CAPACITY_UNDER_2)}

        <Label id="numberOfChildren">{renderText(LABELS.AGE_SCHOOL)}</Label>
        {renderPlusMinus(PROPERTY_TYPES.CAPACITY_OVER_5)}

      </Wrapper>
    );
  }

}
