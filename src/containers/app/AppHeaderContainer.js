/*
 * @flow
 */

import React, { useState } from 'react';

import styled from 'styled-components';
import { faBars, faHome } from '@fortawesome/pro-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Colors, Drawer, StyleUtils } from 'lattice-ui-kit';
import { withRouter } from 'react-router';

import AppNavigationSidebar from './AppNavigationSidebar';
import AppHeaderNavigation from './AppHeaderNavigation';

import CustomColors from '../../core/style/Colors';
import * as Routes from '../../core/router/Routes';
import { CDSSLink, CaGovLink } from '../../components/logos';
import { HEADER_HEIGHT } from '../../core/style/Sizes';

const { NEUTRAL } = Colors;
const { CA_BLUE } = CustomColors;
const { media } = StyleUtils;

// TODO: this should come from lattice-ui-kit, maybe after the next release. current version v0.1.1
const APP_HEADER_BORDER :string = NEUTRAL.N100;

const AppHeaderOuterWrapper = styled.header`
  background-color: ${CA_BLUE};
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

const LeftSideContentWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
`;

const LogoTitleWrapperLink = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex: 0 0 auto;
  padding: 15px 0;
  text-decoration: none;
  justify-content: flex-start;

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
  color: ${NEUTRAL.N700};
  cursor: pointer;
  display: none;
  font-size: 16px;
  height: 32px;
  justify-content: center;
  left: 0;
  margin-left: 10px; /* the icon is 14px wide, this div is 32px wide, so there's 9px on each side of the icon */
  position: absolute;
  width: 32px;

  &:hover {
    color: ${NEUTRAL.N700};
  }

  ${media.phone`
    display: flex;
  `}

  ${media.tablet`
    display: flex;
  `}
`;

const LogoWrapper = styled.div`
  align-items: center;
  display: flex;
  margin-left: 36px;

  svg,
  img {
    margin-right: 16px;
  }

  ${media.phone`
    display: none;
  `}

  ${media.tablet`
    display: none;
  `}
`;

const AppHeaderContainer = () => {

  const [isNavigationOpen, setNavigationState] = useState(false);

  const closeNavigation = () => {
    if (isNavigationOpen) {
      setNavigationState(false);
    }
  };

  const toggleNavigation = () => {
    setNavigationState(!isNavigationOpen);
  };

  return (
    <>
      <AppHeaderOuterWrapper>
        <LeftSideContentWrapper>
          <LogoTitleWrapperLink to={Routes.ROOT}>
            <NavigationToggleWrapper onClick={toggleNavigation}>
              <FontAwesomeIcon color="white" icon={faBars} />
            </NavigationToggleWrapper>
            <LogoWrapper>
              <a aria-label="link to https://mychildcare.ca.gov/" href="https://mychildcare.ca.gov/">
                <FontAwesomeIcon color="white" icon={faHome} />
              </a>
              <CaGovLink />
              <CDSSLink />
            </LogoWrapper>
          </LogoTitleWrapperLink>
        </LeftSideContentWrapper>
        <AppHeaderNavigation />
        <Drawer
            side="left"
            isOpen={isNavigationOpen}
            onClose={closeNavigation}>
          <AppNavigationSidebar onClose={closeNavigation} />
        </Drawer>
      </AppHeaderOuterWrapper>
    </>
  );
};

export default withRouter<*>(AppHeaderContainer);
