/*
 * @flow
 */

import React from 'react';
import ReactDOM from 'react-dom';

import LatticeAuth from 'lattice-auth';
import { ConnectedRouter } from 'connected-react-router/immutable';
import { Colors } from 'lattice-ui-kit';
import { normalize } from 'polished';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

import AppContainer from './containers/app/AppContainer';
import Logout from './core/router/Logout';
import initializeReduxStore from './core/redux/ReduxStore';
import initializeRouterHistory from './core/router/RouterHistory';
import * as Routes from './core/router/Routes';

// injected by Webpack.DefinePlugin
declare var __AUTH0_CLIENT_ID__ :string;
declare var __AUTH0_DOMAIN__ :string;

const { AuthRoute, AuthUtils } = LatticeAuth;
const { NEUTRALS } = Colors;

/* eslint-disable */
const NormalizeCSS = createGlobalStyle`
  ${normalize()}
`;

const GlobalStyle = createGlobalStyle`
  html,
  body {
    background-color: ${NEUTRALS[7]};
    color: ${NEUTRALS[0]};
    line-height: 1.5;
    font-family: 'Open Sans', sans-serif;
    height: 100%;
    width: 100%;
  }

  * {
    box-sizing: border-box;
  }

  *::before,
  *::after {
    box-sizing: border-box;
  }

  #app {
    display: block;
    height: 100%;
    width: 100%;
  }
`;
/* eslint-enable */

/*
 * // !!! MUST HAPPEN FIRST !!!
 */

LatticeAuth.configure({
  auth0ClientId: __AUTH0_CLIENT_ID__,
  auth0Domain: __AUTH0_DOMAIN__,
  authToken: AuthUtils.getAuthToken(),
});

/*
 * // !!! MUST HAPPEN FIRST !!!
 */

const routerHistory = initializeRouterHistory();
const reduxStore = initializeReduxStore(routerHistory);

const APP_ROOT_NODE = document.getElementById('app');
if (APP_ROOT_NODE) {
  ReactDOM.render(
    <Provider store={reduxStore}>
      <>
        <ConnectedRouter history={routerHistory}>
          <Route path={Routes.LOGOUT_PATH} component={Logout} />
          <AuthRoute path={Routes.ROOT} component={AppContainer} redirectToLogin />
        </ConnectedRouter>
        <NormalizeCSS />
        <GlobalStyle />
      </>
    </Provider>,
    APP_ROOT_NODE
  );
}
