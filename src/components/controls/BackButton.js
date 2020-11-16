// @flow
import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';

const { PURPLE } = Colors;

const BackButton = styled.div`
  align-items: center;
  color: ${PURPLE.P300};
  display: flex;
  flex-direction: row;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;

  :hover {
    text-decoration: underline;
  }

  span {
    margin-left: 15px;
  }

  &:hover {
    cursor: pointer;
  }
`;

export default BackButton;
