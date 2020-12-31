/*
 * @flow
 */

import React from 'react';

import styled, { css } from 'styled-components';
import { Colors, StyleUtils } from 'lattice-ui-kit';
import { useDispatch, useSelector } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import { switchLanguage } from './AppActions';

import CustomColors from '../../core/style/Colors';
import {
  ABOUT_PATH,
  FAQS_PATH,
  HOME_PATH,
  RESOURCES_PATH
} from '../../core/router/Routes';
import { getTextFnFromState } from '../../utils/AppUtils';
import {
  CURRENT_LANGUAGE,
  LABELS,
  LANGUAGES
} from '../../utils/constants/labels';

const { media } = StyleUtils;
const { CA_BLUE } = CustomColors;
const { NEUTRAL } = Colors;

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
  ${menuRowStyle}
`;

const MenuRowMailtoLink = styled.a`
  ${menuRowStyle}
`;

const MenuRowNavLink = styled(Link)`
  ${menuRowStyle}
`;

const Lang = styled.div`
  color: ${(props) => (props.isSelected ? 'white' : NEUTRAL.N200)};
  font-weight: ${(props) => (props.isSelected ? 600 : 400)};

  &:hover {
    cursor: pointer;
  }

  &:not(:last-child) {
    margin-right: 20px;
  }
`;

const FEEDBACK_EMAIL = 'mychildcare@dss.ca.gov';

const AppNavigationSidebar = () => {
  const dispatch = useDispatch();
  const getText = useSelector(getTextFnFromState);

  const getSetLang = (lang) => dispatch(switchLanguage(lang));
  const currLang = getText(CURRENT_LANGUAGE);

  const renderLang = (lang, label) => (
    <Lang onClick={() => getSetLang(lang)} isSelected={lang === currLang}>{label}</Lang>
  );

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
      <MenuRow lang={currLang}>
        {renderLang(LANGUAGES.en, 'English')}
      </MenuRow>
      <MenuRow lang={currLang}>
        {renderLang(LANGUAGES.es, 'Español')}
      </MenuRow>
    </Wrapper>
  );
};

export default withRouter<*>(AppNavigationSidebar);
