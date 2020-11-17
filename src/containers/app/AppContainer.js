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
  StylesProvider,
  ThemeProvider,
  lightTheme,
} from 'lattice-ui-kit';
import { ReduxUtils } from 'lattice-utils';
import { connect } from 'react-redux';
import { Redirect, Route, Switch } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import type { RequestSequence, RequestState } from 'redux-reqseq';

import AppHeaderContainer from './AppHeaderContainer';
import { INITIALIZE_APPLICATION, initializeApplication } from './AppActions';

import AboutPage from '../about/AboutPage';
import IEModal from '../../components/modals/IEModal';
import LocationsContainer from '../location/providers/LocationsContainer';
import ResourcesPage from '../resources/ResourcesPage';
import { APP, REQUEST_STATE } from '../../core/redux/constants';
import { ABOUT_PATH, HOME_PATH, RESOURCES_PATH } from '../../core/router/Routes';
import {
  HEADER_HEIGHT,
  MEDIA_QUERY_LG,
  MEDIA_QUERY_MD,
  MEDIA_QUERY_TECH_SM
} from '../../core/style/Sizes';
import { browserIsIE, getTextFnFromState } from '../../utils/AppUtils';
import { loadCurrentPosition } from '../location/LocationsActions';
import type { Translation } from '../../types';

const { isPending } = ReduxUtils;

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
  bottom: 0;
  display: flex;
  flex: 1 0 auto;
  height: auto;
  justify-content: center;
  overflow: auto;
  position: fixed;
  top: ${HEADER_HEIGHT}px;
  width: 100vw;
`;

type Props = {
  actions :{
    initializeApplication :RequestSequence;
    loadCurrentPosition :RequestSequence;
  };
  initializeApplicationRS :RequestState;
  getText :(translation :Translation) => string;
};

class AppContainer extends Component<Props> {

  componentDidMount() {
    const { actions } = this.props;
    actions.initializeApplication();
    actions.loadCurrentPosition({ shouldSearchIfLocationPerms: true });
  }

  renderUnsupportedBrowserModal = () => {
    const { getText } = this.props;
    return (browserIsIE() ? <IEModal getText={getText} /> : null);
  }

  renderAppContent = () => {

    const { initializeApplicationRS } = this.props;

    if (isPending(initializeApplicationRS)) {
      return <Spinner size="3x" />;
    }

    return (
      <Switch>
        <Route exact strict path={HOME_PATH} component={LocationsContainer} />
        <Route path={ABOUT_PATH} component={AboutPage} />
        <Route path={RESOURCES_PATH} component={ResourcesPage} />
        <Redirect to={HOME_PATH} />
      </Switch>
    );
  }

  render() {
    return (
      <ThemeProvider theme={lightTheme}>
        <MuiPickersUtilsProvider utils={LatticeLuxonUtils}>
          <StylesProvider injectFirst>
            <AppContainerWrapper>
              <AppHeaderContainer />
              <AppContentOuterWrapper>
                { this.renderUnsupportedBrowserModal() }
                { this.renderAppContent() }
              </AppContentOuterWrapper>
            </AppContainerWrapper>
          </StylesProvider>
        </MuiPickersUtilsProvider>
      </ThemeProvider>
    );
  }
}

function mapStateToProps(state :Map<*, *>) :Object {

  return {
    initializeApplicationRS: state.getIn([APP, INITIALIZE_APPLICATION, REQUEST_STATE]),
    getText: getTextFnFromState(state)
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
