/*
 * @flow
 */

import React, { Component } from 'react';
import Select from 'react-select';
import { Map } from 'immutable';

import styled from 'styled-components';
import { AuthActions, AuthUtils } from 'lattice-auth';
import { Button, Colors, Drawer } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { faBars } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import OpenLatticeLogo from '../../assets/images/logo_v2.png';
import AppNavigationSidebar from './AppNavigationSidebar';
import LocationsSearchBar from '../location/providers/LocationSearchBar';
import { selectStyles } from './SelectStyles';
import { getRenderTextFn } from '../../utils/AppUtils';
import * as AppActions from './AppActions';
import * as Routes from '../../core/router/Routes';
import {
  APP_CONTAINER_WIDTH,
  APP_CONTENT_PADDING,
  HEADER_HEIGHT
} from '../../core/style/Sizes';
import { OTHER_LANGUAGE, LANGUAGES } from '../../utils/constants/Labels';
import { APP, EDM, STATE } from '../../utils/constants/StateConstants';

const { NEUTRALS, WHITE } = Colors;

// TODO: this should come from lattice-ui-kit, maybe after the next release. current version v0.1.1
const APP_HEADER_BORDER :string = '#e6e6eb';

const AppHeaderOuterWrapper = styled.header`
  background-color: ${WHITE};
  border-bottom: 1px solid ${APP_HEADER_BORDER};
  display: flex;
  flex: 0 0 auto;
  justify-content: center;
  height: ${HEADER_HEIGHT}px;
  position: fixed;
  top: 0;
  width: 100vw;
`;

const AppHeaderInnerWrapper = styled.div`
  align-items: center;
  display: flex;
  flex: 1 0 auto;
  justify-content: space-between;
  max-width: ${APP_CONTAINER_WIDTH}px;
  padding: 0 ${APP_CONTENT_PADDING}px;
`;

const LeftSideContentWrapper = styled.div`
  display: flex;
  flex: 0 0 auto;
  justify-content: flex-start;
`;

const RightSideContentWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const SwitchLanguage = styled.span`
  margin-right: 10px;
  font-family: 'Open Sans', sans-serif;
  font-size: 12px;
  color: #8E929B;

  &:hover {
    cursor: pointer;
  }
`;

const LogoTitleWrapperLink = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex: 0 0 auto;
  padding: 15px 0;
  text-decoration: none;

  &:focus {
    text-decoration: none;
  }

  &:hover {
    outline: none;
    text-decoration: none;
  }
`;

const NavigationToggleWrapper = styled.div`
  align-items: center;
  color: ${NEUTRALS[1]};
  cursor: pointer;
  display: flex;
  font-size: 16px;
  height: 32px;
  justify-content: center;
  left: 0;
  margin-left: 10px; /* the icon is 14px wide, this div is 32px wide, so there's 9px on each side of the icon */
  position: absolute;

  width: 32px;

  &:hover {
    color: ${NEUTRALS[0]};
  }
`;

// 2019-02-19 - Cannot call `styled.img.attrs` because undefined [1] is incompatible with string [2].
// $FlowFixMe
const AppLogoIcon = styled.img.attrs({
  alt: 'OpenLattice Logo Icon',
  src: OpenLatticeLogo,
})`
  height: 26px;
`;

const AppTitle = styled.h1`
  color: ${NEUTRALS[0]};
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  margin: 0 0 0 10px;
  min-width: fit-content;
`;

const OrgSelectionBar = styled.div`
  padding: 5px 30px;
  color: #2e2e34;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

type Props = {
  actions :{
    logout :() => void;
    switchOrganization :(organizationId :string) => void
  };
};

class AppHeaderContainer extends Component<Props> {

  constructor(props) {
    super(props);
    this.state = {
      isNavigationOpen: false
    };
  }

  closeNavigation = () => {

    const { isNavigationOpen } = this.state;
    if (isNavigationOpen) {
      this.setState({ isNavigationOpen: false });
    }
  }

  toggleNavigation = () => {

    const { isNavigationOpen } = this.state;
    this.setState({ isNavigationOpen: !isNavigationOpen });
  }

  getDisplayName = () => {
    const userInfo = AuthUtils.getUserInfo();
    return (userInfo.email && userInfo.email.length > 0) ? userInfo.email : '';
  };

  renderLeftSideContent = () => {

    return (
      <LeftSideContentWrapper>
        <LogoTitleWrapperLink to={Routes.ROOT}>
          <NavigationToggleWrapper onClick={this.toggleNavigation}>
            <FontAwesomeIcon icon={faBars} />
          </NavigationToggleWrapper>
        </LogoTitleWrapperLink>
      </LeftSideContentWrapper>
    );
  }

  render() {
    const { isNavigationOpen } = this.state;

    return (
      <AppHeaderOuterWrapper>
        { this.renderLeftSideContent() }
        <Drawer
            side="left"
            isOpen={isNavigationOpen}
            onClose={this.closeNavigation}>
          <AppNavigationSidebar onClose={this.closeNavigation} />
        </Drawer>
        <AppHeaderInnerWrapper>
          <LocationsSearchBar />
        </AppHeaderInnerWrapper>
      </AppHeaderOuterWrapper>
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
  connect(mapStateToProps, mapDispatchToProps)(AppHeaderContainer)
);
