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
  onChange :(value :number) => void;
  value :number,
}

const Wrapper = styled.div`
  align-items: center;
  background-color: ${NEUTRAL.N50};
  border: 1px solid ${NEUTRAL.N100};
  border-radius: 3px;
  display: flex;
  flex-direction: row;
  height: 40px;
  justify-content: space-between;
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
