import styled from 'styled-components';

import chromeLogo from '../../assets/svg/chromeicon.svg';

const Chrome = styled.img.attrs({
  alt: 'chrome icon',
  src: chromeLogo
})`
  height: 34px;
  width: 34px;
`;

export default Chrome;
