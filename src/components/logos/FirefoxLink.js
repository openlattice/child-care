/*
 * @flow
 */
import React from 'react';

import Firefox from './Firefox';

import { LogoLink } from '../layout';

const FirefoxLink = () => (
  <LogoLink aria-label="link to https://www.mozilla.org/en-US/firefox/new/" href="https://www.mozilla.org/en-US/firefox/new/">
    <Firefox />
  </LogoLink>
);

export default FirefoxLink;
