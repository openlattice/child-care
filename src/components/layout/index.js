import styled, { css } from 'styled-components';
import { Colors, StyleUtils, Typography } from 'lattice-ui-kit';

import { APP_CONTAINER_WIDTH } from '../../core/style/Sizes';

const { NEUTRAL, BLUE } = Colors;
const { media } = StyleUtils;

export const ContentOuterWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
`;

const getContentPadding = ({ padding }) => {
  if (padding === 'none') {
    return null;
  }

  if (padding) {
    return css`
      padding: ${padding};
    `;
  }

  return css`
    padding: 30px;
    ${media.phone`
      padding: 10px;
    `}
  `;
};

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  align-self: center;
  justify-content: flex-start;
  max-width: ${APP_CONTAINER_WIDTH}px;
  width: 100vw;
  ${getContentPadding}
`;

export const UL = styled.ul`
  padding-inline-start: 20px;
`;

export const DashedList = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  > div {
    border-bottom: 1px dashed ${NEUTRAL.N300};
  }

  > div:last-child {
    border-bottom: 0;
  }
`;

export const H1 = styled.h1`
  display: flex;
  flex: 1;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  align-items: center;
`;

export const IconWrapper = styled.span`
  vertical-align: middle;
  margin-right: 10px;
`;

export const HeaderActions = styled.div`
  display: flex;
  margin-left: auto;
`;

export const OpenClosedTag = styled.div`
  color: ${(props) => props.color};
  font-size: 14px;
  font-style: normal;
  font-weight: normal;
  line-height: 17px;
`;

export const TextLink = styled.a.attrs({
  target: '_blank'
})`
  color: ${BLUE.B400};
  cursor: pointer;
`;

export const Body3 = styled(Typography).attrs({
  variant: 'body1'
})`
  font-size: 0.875rem;
`;

export const LogoLink = styled.a.attrs({
  target: '_blank'
})`
  img {
    margin-right: 15px;
  }
`;
