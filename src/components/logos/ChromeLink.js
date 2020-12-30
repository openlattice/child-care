/*
 * @flow
 */
import React from 'react';

import Chrome from './Chrome';

import { LogoLink } from '../layout';

const ChromeLink = () => (
  <LogoLink aria-label="link to https://www.google.com/chrome/" href="https://www.google.com/chrome/">
    <Chrome />
  </LogoLink>
);

export default ChromeLink;
