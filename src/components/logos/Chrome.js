import styled from 'styled-components';

import chromeLogo from '../../assets/svg/chromeicon.svg';

const Chrome = styled.img.attrs({
  alt: 'chrome icon',
  src: chromeLogo
})`
  height: 40px;
  width: 40px;
`;

export default Chrome;
