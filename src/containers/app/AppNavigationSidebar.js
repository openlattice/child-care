/*
 * @flow
 */

import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import Select from 'react-select';
import { Map } from 'immutable';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { AuthActions, AuthUtils } from 'lattice-auth';
import { Button, Colors, Drawer } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import OpenLatticeLogo from '../../assets/images/logo_v2.png';
import { selectStyles } from './SelectStyles';
import { getRenderTextFn } from '../../utils/AppUtils';
import * as AppActions from './AppActions';
import * as Routes from '../../core/router/Routes';
import {
  APP_CONTAINER_WIDTH,
  APP_CONTENT_PADDING,
  HEADER_HEIGHT
} from '../../core/style/Sizes';
import { LABELS, CURRENT_LANGUAGE, LANGUAGES } from '../../utils/constants/Labels';
import { APP, EDM, STATE } from '../../utils/constants/StateConstants';
import { ABOUT_PATH } from '../../core/router/Routes';
import { HOME_PATH } from '../../longbeach/routes';

const { NEUTRALS, WHITE } = Colors;

// TODO: this should come from lattice-ui-kit, maybe after the next release. current version v0.1.1
const APP_HEADER_BORDER :string = '#e6e6eb';

const DEFAULT_PADDING = css`padding: 20px 24px;`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
`;

const NavMenuWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const menuRowStyle = css`
  display: flex;
  flex-direction: row;
  ${DEFAULT_PADDING}
  border-bottom: 1px solid #E6E6EB;
  font-family: Inter;
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  text-decoration: none;

  color: ${(props) => (props.isBack ? Colors.PURPLES[1] : '#555E6F')};

  span {
    margin-right: 10px;
  }

  &:hover {
    cursor: pointer;
  }
`

const MenuRow = styled.div`${menuRowStyle}`;

const MenuRowLink = styled.a.attrs({
  target: '_blank'
})`${menuRowStyle}`;

const MenuRowNavLink = styled(Link)`
  ${menuRowStyle}
`;

const NavFooter = styled.div`
  display: flex;
  flex-direction: row;
  ${DEFAULT_PADDING}
`;

const Lang = styled.div`
  font-family: Inter;
  font-style: normal;
  font-size: 14px;
  line-height: 17px;

  font-weight: ${(props) => (props.isSelected ? 600 : 400)};
  color: ${(props) => (props.isSelected ? '#6124E2' : '#555E6F')};

  &:hover {
    cursor: pointer;
  }

  &:not(:last-child) {
    margin-right: 20px;
  }
`;

type Props = {
  actions :{
    logout :() => void;
    switchLanguage :Function
  };
};

const PRIVACY_POLICY_URL = 'https://cdss.ca.gov/privacy-policy';
const CONDITIONS_OF_USE_URL = 'https://cdss.ca.gov/conditions-of-use';

class AppNavigationSidebar extends Component<Props> {

  getSetLang = (lang) => {
    const { actions } = this.props;
    return () => actions.switchLanguage(lang);
  }

  renderLang = (lang, label) => {
    const { renderText } = this.props;

    const currLang = renderText(CURRENT_LANGUAGE);

    return (
      <Lang onClick={this.getSetLang(lang)} isSelected={lang === currLang}>{label}</Lang>
    );
  }

  render() {

    const { onClose, renderText } = this.props;

    return (
      <Wrapper>
        <NavMenuWrapper>

          <MenuRow isBack onClick={onClose}>
            <span><FontAwesomeIcon icon={faChevronLeft} /></span>
            {renderText(LABELS.BACK)}
          </MenuRow>
          <MenuRowNavLink to={HOME_PATH} onClick={onClose}>
            {renderText(LABELS.FIND_CHILDCARE)}
          </MenuRowNavLink>
          <MenuRowNavLink to={ABOUT_PATH} onClick={onClose}>
            {renderText(LABELS.ABOUT)}
          </MenuRowNavLink>
          <MenuRowLink href={CONDITIONS_OF_USE_URL}>
            {renderText(LABELS.TERMS_AND_CONDITIONS)}
          </MenuRowLink>
          <MenuRowLink href={PRIVACY_POLICY_URL}>
            {renderText(LABELS.PRIVACY_POLICY)}
          </MenuRowLink>
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
    renderText: getRenderTextFn(state)
  };
}


const mapDispatchToProps = (dispatch :Function) :Object => ({
  actions: bindActionCreators({
    logout: AuthActions.logout,
    switchOrganization: AppActions.switchOrganization,
    switchLanguage: AppActions.switchLanguage
  }, dispatch)
});

export default withRouter<*>(
  connect(mapStateToProps, mapDispatchToProps)(AppNavigationSidebar)
);
