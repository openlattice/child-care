/*
 * @flow
 */

import React from 'react';

import styled, { css } from 'styled-components';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import LanguageSelectionMenu from './LanguageSelectionMenu';

import CustomColors from '../../core/style/Colors';
import { CDSSLink, CaGovLink } from '../../components/logos';
import {
  ABOUT_PATH,
  FAQS_PATH,
  HOME_PATH,
  RESOURCES_PATH
} from '../../core/router/Routes';
import { getTextFnFromState } from '../../utils/AppUtils';
import {
  CONDITIONS_OF_USE_URL,
  PRIVACY_POLICY_URL,
  REGISTER_TO_VOTE_URL
} from '../../utils/constants/URLs';
import { LABELS } from '../../utils/constants/labels';

const { CA_BLUE } = CustomColors;

const DEFAULT_PADDING = css` padding: 20px 24px; `;

const Wrapper = styled.div`
  background-color: ${CA_BLUE};
  display: flex;
  flex-direction: column;
  min-height: calc(100vh + 80px);
  justify-content: space-between;
  overflow: scroll;

  ::-webkit-scrollbar {
    display: none;
  }
`;

const NavMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const menuRowStyle = css`
  border-bottom: 1px solid white;
  color: white;
  ${DEFAULT_PADDING}
  display: flex;
  flex-direction: row;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 17px;
  min-height: 58px;
  text-decoration: none;

  span {
    margin-right: 10px;
  }

  &:hover {
    cursor: pointer;
  }
`;

const MenuRow = styled.div`
  ${menuRowStyle}
`;

const LanguageRow = styled.div`
  ${menuRowStyle}
  min-height: 79px;
`;

const LogoRow = styled.div`
  ${menuRowStyle}
  min-height: 66px;
  padding: 10px 24px;

  img {
    height: 46px;
    width: auto;
    margin-right: 10px;
  }
`;

const MenuRowLink = styled.a.attrs({
  target: '_blank'
})`
  ${menuRowStyle}
`;

const MenuRowMailtoLink = styled.a`
  ${menuRowStyle}
`;

const MenuRowNavLink = styled(Link)`
  ${menuRowStyle}
`;

const NavFooter = styled.div`
  color: white;
  display: flex;
  flex-direction: column;
  font-weight: 400px;
  flex-grow: 1;
  justify-content: flex-start;
  ${DEFAULT_PADDING}
`;

const AppNavigationSidebar = ({ onClose }:{| onClose :() => void; |}) => {
  const getText = useSelector(getTextFnFromState);
  return (
    <Wrapper>
      <NavMenuWrapper>
        <MenuRow isBack onClick={onClose}>
          <span><FontAwesomeIcon icon={faChevronLeft} /></span>
          {getText(LABELS.BACK)}
        </MenuRow>
        <LogoRow>
          <CaGovLink />
          <CDSSLink />
        </LogoRow>
        <LanguageRow>
          <LanguageSelectionMenu />
        </LanguageRow>
        <MenuRowNavLink to={HOME_PATH} onClick={onClose}>
          {getText(LABELS.FIND_CHILDCARE)}
        </MenuRowNavLink>
        <MenuRowNavLink to={ABOUT_PATH} onClick={onClose}>
          {getText(LABELS.ABOUT)}
        </MenuRowNavLink>
        <MenuRowNavLink to={FAQS_PATH} onClick={onClose}>
          {getText(LABELS.FAQ)}
        </MenuRowNavLink>
        <MenuRowNavLink to={RESOURCES_PATH} onClick={onClose}>
          {getText(LABELS.RESOURCES)}
        </MenuRowNavLink>
        <MenuRowLink href={CONDITIONS_OF_USE_URL}>
          {getText(LABELS.TERMS_AND_CONDITIONS)}
        </MenuRowLink>
        <MenuRowLink href={PRIVACY_POLICY_URL}>
          {getText(LABELS.PRIVACY_POLICY)}
        </MenuRowLink>
        <MenuRowMailtoLink href={REGISTER_TO_VOTE_URL}>
          {getText(LABELS.REGISTER_TO_VOTE)}
        </MenuRowMailtoLink>
      </NavMenuWrapper>
      <NavFooter>
        Copyright © 2020 State of California
      </NavFooter>
    </Wrapper>
  );
};

export default AppNavigationSidebar;
