// @flow
import React from 'react';

import { Map } from 'immutable';
import { connect } from 'react-redux';
import {
  Redirect,
  Route,
  Switch,
} from 'react-router';

import PremiumProfileRouter from './premium/PremiumProfileRouter';
import ProfileContainer from './ProfileContainer';

import {
  HOME_PATH,
  PROFILE_VIEW_PATH
} from '../../core/router/Routes';

type Props = {
  selectedOrganizationSettings :Map;
};

const ProfileRouter = ({ selectedOrganizationSettings } :Props) => {
  const premium = selectedOrganizationSettings.get('premium', false);
  const profileComponent = premium ? PremiumProfileRouter : ProfileContainer;

  return (
    <Switch>
      <Route strict path={PROFILE_VIEW_PATH} component={profileComponent} />
      <Redirect to={HOME_PATH} />
    </Switch>
  );
};

const mapStateToProps = (state) => ({
  selectedOrganizationSettings: state.getIn(['app', 'selectedOrganizationSettings'], Map())
});

// $FlowFixMe
export default connect(mapStateToProps)(ProfileRouter);
