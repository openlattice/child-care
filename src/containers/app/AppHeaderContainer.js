/*
 * @flow
 */

import React, { Component } from 'react';
import Select from 'react-select';
import { Map } from 'immutable';

import styled from 'styled-components';
import { AuthActions, AuthUtils } from 'lattice-auth';
import { Button, Colors } from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

import OpenLatticeLogo from '../../assets/images/logo_v2.png';
import { selectStyles } from './SelectStyles';
import * as AppActions from './AppActions';
import * as Routes from '../../core/router/Routes';
import {
  APP_CONTAINER_WIDTH,
  APP_CONTENT_PADDING,
} from '../../core/style/Sizes';
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
  align-items: center;
  display: flex;
  flex: 1 0 auto;
  justify-content: flex-end;
`;

const DisplayName = styled.span`
  margin-right: 10px;
  font-family: 'Open Sans', sans-serif;
  font-size: 12px;
  color: #2e2e34;
`;

const LogoTitleWrapperLink = styled(Link)`
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
`;

const OrgSelectionBar = styled.div`
  padding: 5px 30px;
  color: #2e2e34;
  font-weight: 600;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LogoutButton = styled(Button)`
  font-size: 12px;
  line-height: 16px;
  margin-left: 30px;
  padding: 6px 29px;
`;

type Props = {
  actions :{
    logout :() => void;
    switchOrganization :(organizationId :string) => void
  };
};

class AppHeaderContainer extends Component<Props> {

  getDisplayName = () => {
    const userInfo = AuthUtils.getUserInfo();
    return (userInfo.email && userInfo.email.length > 0) ? userInfo.email : '';
  };

  renderOrgSelection = () => {

    const { actions, orgs, selectedOrganizationId } = this.props;

    if (!orgs.size) {
      return null;
    }

    const organizationOptions = orgs
      .map((organization :Map<*, *>) => ({
        label: organization.get('title'),
        value: organization.get('id'),
      }))
      .toJS();

    const handleOnChange = (event) => {
      const orgId = event.value;
      if (orgId !== selectedOrganizationId) {
        actions.switchOrganization(orgId);
      }
    };

    return (
      <OrgSelectionBar>
        <Select
            value={organizationOptions.find(option => option.value === selectedOrganizationId)}
            isClearable={false}
            isMulti={false}
            onChange={handleOnChange}
            options={organizationOptions}
            placeholder="Select..."
            styles={orgSelectStyles} />
      </OrgSelectionBar>
    );
  }

  renderLeftSideContent = () => {

    return (
      <LeftSideContentWrapper>
        <LogoTitleWrapperLink to={Routes.ROOT}>
          <AppLogoIcon />
          <AppTitle>
            Child Care
          </AppTitle>
        </LogoTitleWrapperLink>
      </LeftSideContentWrapper>
    );
  }

  renderRightSideContent = () => {

    const { actions } = this.props;
    return (
      <RightSideContentWrapper>
        {this.renderOrgSelection()}
        <DisplayName>{this.getDisplayName()}</DisplayName>
        <LogoutButton onClick={actions.logout}>
          Log Out
        </LogoutButton>
      </RightSideContentWrapper>
    );
  }

  render() {

    return (
      <AppHeaderOuterWrapper>
        <AppHeaderInnerWrapper>
          { this.renderLeftSideContent() }
        </AppHeaderInnerWrapper>
      </AppHeaderOuterWrapper>
    );
  }
}

function mapStateToProps(state) {
  const app = state.get(STATE.APP);

  return {
    app
  };
}


const mapDispatchToProps = (dispatch :Function) :Object => ({
  actions: bindActionCreators({
    logout: AuthActions.logout,
    switchOrganization: AppActions.switchOrganization
  }, dispatch)
});

export default withRouter<*>(
  connect(mapStateToProps, mapDispatchToProps)(AppHeaderContainer)
);
