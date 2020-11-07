/*
 * @flow
 */

import React from 'react';
import ReactDOM from 'react-dom';

import { ConnectedRouter } from 'connected-react-router/immutable';
import { Colors } from 'lattice-ui-kit';
import { normalize } from 'polished';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';

import AppContainer from './containers/app/AppContainer';
import initializeReduxStore from './core/redux/ReduxStore';
import initializeRouterHistory from './core/router/RouterHistory';
import * as Routes from './core/router/Routes';

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
    font-family: 'Inter', Arial, sans-serif;
    height: 100vh;
    width: 100vw;
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

const routerHistory = initializeRouterHistory();
const reduxStore = initializeReduxStore(routerHistory);

const APP_ROOT_NODE = document.getElementById('app');
if (APP_ROOT_NODE) {
  ReactDOM.render(
    <Provider store={reduxStore}>
      <>
        <ConnectedRouter history={routerHistory}>
          <Route path={Routes.ROOT} component={AppContainer} />
        </ConnectedRouter>
        <NormalizeCSS />
        <GlobalStyle />
      </>
    </Provider>,
    APP_ROOT_NODE
  );
}
