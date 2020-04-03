// @flow

import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPortrait } from '@fortawesome/pro-solid-svg-icons';

const { NEUTRALS } = Colors;

const PlaceholderPortrait = styled(FontAwesomeIcon).attrs(() => ({
  icon: faPortrait,
  color: NEUTRALS[5]
}))`
  height: ${(props) => `${props.height}px`} !important;
  width: ${(props) => `${props.width}px`} !important;
`;

export default PlaceholderPortrait;
