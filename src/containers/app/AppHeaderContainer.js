/*
 * @flow
 */

import React, { Component } from 'react';
import Select from 'react-select';
import { Map } from 'immutable';

import styled from 'styled-components';
import { IconButton, Button, Colors, Drawer } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { faBars, faLocation } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import OpenLatticeLogo from '../../assets/images/logo_v2.png';
import BasicButton from '../../components/buttons/BasicButton';
import AppNavigationSidebar from './AppNavigationSidebar';
import LocationsSearchBar from '../location/providers/LocationSearchBar';

import * as LocationsActions from '../location/providers/LocationsActions';

import { selectStyles } from './SelectStyles';
import { getRenderTextFn } from '../../utils/AppUtils';
import * as AppActions from './AppActions';
import * as Routes from '../../core/router/Routes';
import {
  HEADER_HEIGHT,
  APP_CONTAINER_WIDTH
} from '../../core/style/Sizes';
import { LABELS } from '../../utils/constants/Labels';
import { STATE } from '../../utils/constants/StateConstants';
import { HOME_PATH } from '../../core/router/Routes';

const { NEUTRALS, WHITE } = Colors;

// TODO: this should come from lattice-ui-kit, maybe after the next release. current version v0.1.1
const APP_HEADER_BORDER :string = '#e6e6eb';

const BUTTON_WIDTH = 32;

const AppHeaderOuterWrapper = styled.header`
  background-color: ${WHITE};
  border-bottom: 1px solid ${APP_HEADER_BORDER};
  display: flex;
  flex: 0 0 auto;
  justify-content: center;
  height: ${HEADER_HEIGHT}px;
  top: 0;
  width: 100vw;
  position: fixed;
  z-index: 0;
`;

const RightSideContentWrapper = styled.div`
  align-items: center;
  width: ${BUTTON_WIDTH}px;
  left: min(calc(100vw - ${BUTTON_WIDTH + 10}px), calc(50vw + ${(APP_CONTAINER_WIDTH / 2) + 10}px));
  top: ${(HEADER_HEIGHT / 2) - (BUTTON_WIDTH / 2)}px;
  position: fixed;
`;

const TargetIcon = <FontAwesomeIcon icon={faLocation} fixedWidth />;
const TargetButton = styled(IconButton)`
  height: ${BUTTON_WIDTH}px;
  width: ${BUTTON_WIDTH}px;
  padding: 0;
`;

const LeftSideContentWrapper = styled.div`
  display: flex;
  flex: 0 0 auto;
  justify-content: flex-start;
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

type Props = {
  actions :{
    switchLanguage :(language :string) => void
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

  renderCurrentLocationButton = () => {
    const { actions } = this.props;
    return (
      <RightSideContentWrapper>
        <TargetButton icon={TargetIcon} mode="subtle" onClick={actions.loadCurrentPosition} />
      </RightSideContentWrapper>
    );
  }

  render() {
    const { isNavigationOpen } = this.state;

    const isViewingMap = window.location.hash.includes(HOME_PATH);
    const searchBar = isViewingMap ? <LocationsSearchBar /> : null;

    return (
      <>
        {searchBar}
        <AppHeaderOuterWrapper>
          { this.renderLeftSideContent() }
          <Drawer
              side="left"
              isOpen={isNavigationOpen}
              onClose={this.closeNavigation}>
            <AppNavigationSidebar onClose={this.closeNavigation} />
          </Drawer>
        { this.renderCurrentLocationButton() }
        </AppHeaderOuterWrapper>
      </>
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
    switchLanguage: AppActions.switchLanguage,
    loadCurrentPosition: LocationsActions.loadCurrentPosition
  }, dispatch)
});

export default withRouter<*>(
  connect(mapStateToProps, mapDispatchToProps)(AppHeaderContainer)
);
