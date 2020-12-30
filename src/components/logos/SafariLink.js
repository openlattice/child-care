/*
 * @flow
 */
import React from 'react';

import Safari from './Safari';

import { LogoLink } from '../layout';

const SafariLink = () => (
  <LogoLink aria-label="link to https://support.apple.com/downloads/safari" href="https://support.apple.com/downloads/safari">
    <Safari />
  </LogoLink>
);

export default SafariLink;
