/*
 * @flow
 */

import React, { Component } from 'react';

import styled from 'styled-components';
import { Map } from 'immutable';
import {
  LatticeLuxonUtils,
  MuiPickersUtilsProvider,
  Spinner,
  ThemeProvider,
  lightTheme,
} from 'lattice-ui-kit';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { RequestStates } from 'redux-reqseq';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import AppHeaderContainer from './AppHeaderContainer';
import {
  initializeApplication,
} from './AppActions';

import EncampmentsContainer from '../../longbeach/location/encampment/EncampmentsContainer';
import LongBeachLocationsContainer from '../../longbeach/location/stayaway/LongBeachLocationsContainer';
import LongBeachProviderContainer from '../../longbeach/provider/LongBeachProviderContainer';


import LongBeachHome from '../../longbeach/LongBeachHome';
import LongBeachPeopleContainer from '../../longbeach/people/LongBeachPeopleContainer';
import LongBeachProfileContainer from '../../longbeach/profile/LongBeachProfileContainer';

import {
  ENCAMPMENTS_PATH,
  HOME_PATH,
  LOCATION_PATH,
  PEOPLE_PATH,
  PROFILE_VIEW_PATH,
  PROVIDER_PATH,
} from '../../longbeach/routes';
import {
  APP_CONTAINER_MAX_WIDTH,
  APP_CONTENT_PADDING,
  MEDIA_QUERY_LG,
  MEDIA_QUERY_MD,
  MEDIA_QUERY_TECH_SM
} from '../../core/style/Sizes';

/*
 * styled components
 */

const AppContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0;
  min-width: 300px;
  padding: 0;

  @media only screen and (min-width: ${MEDIA_QUERY_TECH_SM}px) {
    min-width: ${MEDIA_QUERY_TECH_SM};
  }

  @media only screen and (min-width: ${MEDIA_QUERY_MD}px) {
    min-width: ${MEDIA_QUERY_MD};
  }

  @media only screen and (min-width: ${MEDIA_QUERY_LG}px) {
    min-width: ${MEDIA_QUERY_LG};
  }
`;

const AppContentOuterWrapper = styled.main`
  display: flex;
  flex: 1 0 auto;
  justify-content: center;
  position: relative;
`;

const AppContentInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  justify-content: flex-start;
  max-width: ${APP_CONTAINER_MAX_WIDTH}px;
  padding: ${APP_CONTENT_PADDING}px;
  position: relative;
`;


type Props = {
  actions :{
    initializeApplication :RequestSequence;
  };
  initializeState :RequestState;
};

class AppContainer extends Component<Props> {

  componentDidMount() {
    const { actions } = this.props;
    actions.initializeApplication();
  }

  wrapComponent = (AppComponent) => () => <AppContentInnerWrapper><AppComponent /></AppContentInnerWrapper>;

  renderAppContent = () => {

    const {
      initializeState
    } = this.props;

    if (initializeState === RequestStates.PENDING) {
      return <Spinner size="3x" />;
    }

    return (
      <Switch>
        <Route exact strict path={HOME_PATH} component={LongBeachLocationsContainer} />
        <Redirect to={HOME_PATH} />
      </Switch>
    );
  }

  render() {
    return (
      <ThemeProvider theme={lightTheme}>
        <MuiPickersUtilsProvider utils={LatticeLuxonUtils}>
          <AppContainerWrapper>
            <AppHeaderContainer />
            <AppContentOuterWrapper>
              { this.renderAppContent() }
            </AppContentOuterWrapper>
          </AppContainerWrapper>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    initializeState: state.getIn(['app', 'initializeState'])
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    initializeApplication,
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect<*, *, *, *, *, *>(mapStateToProps, mapDispatchToProps)(AppContainer);
