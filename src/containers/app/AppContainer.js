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
import { initializeApplication } from './AppActions';

import AboutPage from '../about/AboutPage';
import IEModal from '../../components/modals/IEModal';
import LocationsContainer from '../location/providers/LocationsContainer';
import { ABOUT_PATH, HOME_PATH } from '../../core/router/Routes';
import {
  APP_CONTAINER_MAX_WIDTH,
  APP_CONTENT_PADDING,
  HEADER_HEIGHT,
  MEDIA_QUERY_LG,
  MEDIA_QUERY_MD,
  MEDIA_QUERY_TECH_SM
} from '../../core/style/Sizes';
import { browserIsIE, getRenderTextFn } from '../../utils/AppUtils';
import { loadCurrentPosition } from '../location/LocationsActions';

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
  position: fixed;
  bottom: 0;
  overflow: auto;

  height: auto;
  top: ${HEADER_HEIGHT}px;
  width: 100vw;
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
    loadCurrentPosition :RequestSequence;
  };
  initializeState :RequestState;
};

class AppContainer extends Component<Props> {

  componentDidMount() {
    const { actions } = this.props;
    actions.initializeApplication();
    actions.loadCurrentPosition({ shouldSearchIfLocationPerms: true });
  }

  wrapComponent = (AppComponent) => () => <AppContentInnerWrapper><AppComponent /></AppContentInnerWrapper>;

  renderUnsupportedBrowserModal = () => {
    const { renderText } = this.props;
    return (browserIsIE() ? <IEModal renderText={renderText} /> : null);
  }

  renderAppContent = () => {

    const {
      initializeState
    } = this.props;

    if (initializeState === RequestStates.PENDING) {
      return <Spinner size="3x" />;
    }

    return (
      <Switch>
        <Route exact strict path={HOME_PATH} component={LocationsContainer} />
        <Route path={ABOUT_PATH} component={AboutPage} />
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
              { this.renderUnsupportedBrowserModal() }
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
    initializeState: state.getIn(['app', 'initializeState']),
    renderText: getRenderTextFn(state)
  };
}

function mapDispatchToProps(dispatch :Function) :Object {

  const actions = {
    initializeApplication,
    loadCurrentPosition
  };

  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect<*, *, *, *, *, *>(mapStateToProps, mapDispatchToProps)(AppContainer);
