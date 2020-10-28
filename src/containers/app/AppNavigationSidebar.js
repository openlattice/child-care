/*
 * @flow
 */

import React, { Component } from 'react';

import styled, { css } from 'styled-components';
import { faChevronLeft } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Colors } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';

import * as AppActions from './AppActions';

import { ABOUT_PATH, HOME_PATH } from '../../core/router/Routes';
import { getRenderTextFn } from '../../utils/AppUtils';
import { CURRENT_LANGUAGE, LABELS, LANGUAGES } from '../../utils/constants/Labels';
import { STATE } from '../../utils/constants/StateConstants';

const { NEUTRAL, PURPLE } = Colors;

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
  border-bottom: 1px solid ${NEUTRAL.N100};
  font-style: normal;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  text-decoration: none;

  color: ${(props) => (props.isBack ? PURPLE.P300 : NEUTRAL.N700)};

  span {
    margin-right: 10px;
  }

  &:hover {
    cursor: pointer;
  }
`;

const MenuRow = styled.div`${menuRowStyle}`;

const MenuRowLink = styled.a.attrs({
  target: '_blank'
})`${menuRowStyle}`;

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
  font-style: normal;
  font-size: 14px;
  line-height: 17px;

  font-weight: ${(props) => (props.isSelected ? 600 : 400)};
  color: ${(props) => (props.isSelected ? PURPLE.P300 : NEUTRAL.N700)};

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
  renderText :(labels :Object) => string;
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
    const { renderText } = this.props;

    const currLang = renderText(CURRENT_LANGUAGE);

    return (
      <Lang onClick={this.getSetLang(lang)} isSelected={lang === currLang}>{label}</Lang>
    );
  }

  render() {

    const { onClose, renderText } = this.props;

    const feedbackLink = `mailto:${FEEDBACK_EMAIL}?subject=${renderText(LABELS.SEND_FEEDBACK_SUBJECT)}`;

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
          <MenuRowMailtoLink href={feedbackLink}>
            {renderText(LABELS.SEND_FEEDBACK)}
          </MenuRowMailtoLink>
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
    switchLanguage: AppActions.switchLanguage
  }, dispatch)
});

export default withRouter<*>(
  connect(mapStateToProps, mapDispatchToProps)(AppNavigationSidebar)
);
