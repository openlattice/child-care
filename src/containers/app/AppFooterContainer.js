/*
 * @flow
 */

import React from 'react';

import styled from 'styled-components';
import { Colors, StyleUtils } from 'lattice-ui-kit';
import { useSelector } from 'react-redux';

import { getTextFnFromState } from '../../utils/AppUtils';
import {
  CONDITIONS_OF_USE_URL,
  PRIVACY_POLICY_URL,
  REGISTER_TO_VOTE_URL
} from '../../utils/constants/URLs';
import { LABELS } from '../../utils/constants/labels';

const { NEUTRAL } = Colors;
const { media } = StyleUtils;

const Footer = styled.div`
  background-color: ${NEUTRAL.N900};
  bottom: 0;
  color: white;
  display: flex;
  height: 40px;
  justify-content: space-between;
  left: 0;
  position: fixed;
  width: 100%;
  text-align: center;
  ${media.phone`
    display: none;
  `}
  ${media.tablet`
    display: none;
  `}

  > div {
    padding-left: 24px;
    justify-content: flex-start;
  }

  > div:last-child {
    justify-content: flex-end;
    min-width: max-content;
    padding-right: 24px;
  }
`;

const FooterItem = styled.div`
  align-items: center;
  display: flex;
  width: 100%;
`;

const MenuItem = styled.a.attrs({
  target: '_blank'
})`
  align-items: center;
  color: white;
  display: flex;
  min-width: max-content;
  padding-right: 24px;
  text-decoration: none;
`;

const AppFooterContainer = () => {
  const getText = useSelector(getTextFnFromState);

  return (
    <Footer>
      <FooterItem>
        <MenuItem href={CONDITIONS_OF_USE_URL}>
          {getText(LABELS.TERMS_AND_CONDITIONS)}
        </MenuItem>
        <MenuItem href={PRIVACY_POLICY_URL}>
          {getText(LABELS.PRIVACY_POLICY)}
        </MenuItem>
        <MenuItem href={REGISTER_TO_VOTE_URL}>
          {getText(LABELS.SEND_FEEDBACK)}
        </MenuItem>
      </FooterItem>
      <FooterItem>
        Copyright © 2020 State of California
      </FooterItem>
    </Footer>
  );
};

export default AppFooterContainer;
