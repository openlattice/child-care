/*
 * @flow
 */

import React, { Component } from 'react';

import styled, { css } from 'styled-components';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { Colors } from 'lattice-ui-kit';

import * as AppActions from './AppActions';

import CustomColors from '../../core/style/Colors';
import { CDSSLink, CaGovLink } from '../../components/logos';
import {
  ABOUT_PATH,
  FAQS_PATH,
  HOME_PATH,
  RESOURCES_PATH
} from '../../core/router/Routes';
import { getTextFnFromState } from '../../utils/AppUtils';
import { STATE } from '../../utils/constants/StateConstants';
import {
  CURRENT_LANGUAGE,
  LABELS,
  LANGUAGES
} from '../../utils/constants/labels';
import type { Translation } from '../../types';

const { BLUE } = CustomColors;
const { NEUTRAL } = Colors;

const DEFAULT_PADDING = css` padding: 20px 24px; `;

const Wrapper = styled.div`
  background-color: ${BLUE};
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
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

const LogoRow = styled.div`
  ${menuRowStyle}
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
  display: flex;
  flex-direction: row;
  ${DEFAULT_PADDING}
`;

const Lang = styled.div`
  color: ${(props) => (props.isSelected ? 'white' : NEUTRAL.N200)};
  font-size: 14px;
  font-style: normal;
  font-weight: ${(props) => (props.isSelected ? 600 : 400)};
  line-height: 17px;

  &:hover {
    cursor: pointer;
  }

  &:not(:last-child) {
    margin-right: 20px;
  }
`;

type Props = {
  actions :{
    switchLanguage :Function
  };
  onClose :() => void;
  getText :(translation :Translation) => string;
};

const PRIVACY_POLICY_URL = 'https://cdss.ca.gov/privacy-policy';
const CONDITIONS_OF_USE_URL = 'https://cdss.ca.gov/conditions-of-use';
const FEEDBACK_EMAIL = 'mychildcare@dss.ca.gov';

class AppNavigationSidebar extends Component<Props> {

  getSetLang = (lang) => {
    const { actions } = this.props;
    return () => actions.switchLanguage(lang);
  }

  renderLang = (lang, label) => {
    const { getText } = this.props;

    const currLang = getText(CURRENT_LANGUAGE);

    return (
      <Lang onClick={this.getSetLang(lang)} isSelected={lang === currLang}>{label}</Lang>
    );
  }

  render() {

    const { onClose, getText } = this.props;

    const feedbackLink = `mailto:${FEEDBACK_EMAIL}?subject=${getText(LABELS.SEND_FEEDBACK_SUBJECT)}`;

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
          <MenuRowNavLink to={HOME_PATH} onClick={onClose}>
            {getText(LABELS.FIND_CHILDCARE)}
          </MenuRowNavLink>
          <MenuRowNavLink to={ABOUT_PATH} onClick={onClose}>
            {getText(LABELS.ABOUT)}
          </MenuRowNavLink>
          <MenuRowLink href={CONDITIONS_OF_USE_URL}>
            {getText(LABELS.TERMS_AND_CONDITIONS)}
          </MenuRowLink>
          <MenuRowLink href={PRIVACY_POLICY_URL}>
            {getText(LABELS.PRIVACY_POLICY)}
          </MenuRowLink>
          <MenuRowMailtoLink href={feedbackLink}>
            {getText(LABELS.SEND_FEEDBACK)}
          </MenuRowMailtoLink>
          <MenuRowNavLink to={RESOURCES_PATH} onClick={onClose}>
            {getText(LABELS.RESOURCES)}
          </MenuRowNavLink>
          <MenuRowNavLink to={FAQS_PATH} onClick={onClose}>
            {getText(LABELS.FAQ)}
          </MenuRowNavLink>
        </NavMenuWrapper>

        <NavFooter>
          {this.renderLang(LANGUAGES.en, 'English')}
          {this.renderLang(LANGUAGES.es, 'Español')}
        </NavFooter>
      </Wrapper>
    );
  }
}

function mapStateToProps(state) {
  const app = state.get(STATE.APP);

  return {
    app,
    getText: getTextFnFromState(state)
  };
}

const mapDispatchToProps = (dispatch :Function) :Object => ({
  actions: bindActionCreators({
    switchLanguage: AppActions.switchLanguage
  }, dispatch)
});

export default withRouter<*>(
  connect(mapStateToProps, mapDispatchToProps)(AppNavigationSidebar)
);
