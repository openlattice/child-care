import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';
import { Link } from 'react-router-dom';

const { PURPLES } = Colors;

const DefaultLink = styled(Link)`
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  color: ${PURPLES[1]};
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

export default DefaultLink;
