/*
 * @flow
 */

import React from 'react';
import styled from 'styled-components';
import { Colors, IconButton } from 'lattice-ui-kit';
import { faPlus, faMinus } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const { NEUTRAL } = Colors;

type Props = {
  value :number,
  onChange :(value :number) => void;
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-radius: 3px;
  background-color: ${NEUTRAL.N50};
  border: 1px solid ${NEUTRAL.N100};
  height: 40px;
  width: 180px;
`;

const PlusMinus = ({ value, onChange } :Props) => (
  <Wrapper>
    <IconButton disabled={!value} aria-labelledby="numberOfInfants" onClick={() => onChange(value - 1)}>
      <FontAwesomeIcon icon={faMinus} />
    </IconButton>
    <span>{value}</span>
    <IconButton aria-labelledby="numberOfChildren" onClick={() => onChange(value + 1)}>
      <FontAwesomeIcon icon={faPlus} />
    </IconButton>
  </Wrapper>
);

export default PlusMinus;
