/*
 * @flow
 */

import React from 'react';

import styled, { css } from 'styled-components';
import { StyleUtils } from 'lattice-ui-kit';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import LanguageSelectionMenu from './LanguageSelectionMenu';

import CustomColors from '../../core/style/Colors';
import {
  ABOUT_PATH,
  FAQS_PATH,
  HOME_PATH,
  RESOURCES_PATH
} from '../../core/router/Routes';
import { getTextFnFromState } from '../../utils/AppUtils';
import {
  FEEDBACK_EMAIL
} from '../../utils/constants/URLs';
import {
  CURRENT_LANGUAGE,
  LABELS,
  LANGUAGES
} from '../../utils/constants/labels';

const { media } = StyleUtils;
const { CA_BLUE } = CustomColors;

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  justify-content: space-between;
  ${media.phone`
    display: none;
  `}
  ${media.tablet`
    display: none;
  `}
`;

const menuRowStyle = css`
  align-items: center;
  background-color: ${CA_BLUE};
  color: white;
  display: flex;
  min-width: max-content;
  padding: 20px 24px 20px 0;
  text-decoration: none;

  @media (max-width: ${(props) => (props.lang === LANGUAGES.en ? 1000 : 1350)}px) {
    font-size: 14px;
    min-width: min-content;
  }

  span {
    margin-right: 10px;
  }

  &:hover {
    cursor: pointer;
  }
`;

const MenuRow = styled.div`
  align-items: center;
  background-color: ${CA_BLUE};
  color: white;
  display: flex;
  padding: 20px 24px 20px 0;
  min-width: 160px;
`;

const MenuRowMailtoLink = styled.a`
  ${menuRowStyle}
`;

const MenuRowNavLink = styled(Link)`
  ${menuRowStyle}
`;

const AppNavigationSidebar = () => {
  const getText = useSelector(getTextFnFromState);

  const currLang = getText(CURRENT_LANGUAGE);

  const feedbackLink = `mailto:${FEEDBACK_EMAIL}?subject=${getText(LABELS.SEND_FEEDBACK_SUBJECT)}`;

  return (
    <Wrapper>
      <MenuRowNavLink lang={currLang} to={HOME_PATH}>
        {getText(LABELS.FIND_CHILDCARE)}
      </MenuRowNavLink>
      <MenuRowNavLink lang={currLang} to={ABOUT_PATH}>
        {getText(LABELS.ABOUT)}
      </MenuRowNavLink>
      <MenuRowNavLink lang={currLang} to={FAQS_PATH}>
        {getText(LABELS.FAQ)}
      </MenuRowNavLink>
      <MenuRowNavLink lang={currLang} to={RESOURCES_PATH}>
        {getText(LABELS.RESOURCES)}
      </MenuRowNavLink>
      <MenuRowMailtoLink lang={currLang} href={feedbackLink}>
        {getText(LABELS.SEND_FEEDBACK)}
      </MenuRowMailtoLink>
      <MenuRow>
        <LanguageSelectionMenu />
      </MenuRow>
    </Wrapper>
  );
};

export default withRouter<*>(AppNavigationSidebar);
