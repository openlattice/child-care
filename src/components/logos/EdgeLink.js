/*
 * @flow
 */
import React from 'react';

import Edge from './Edge';

import { LogoLink } from '../layout';

const EdgeLink = () => (
  <LogoLink aria-label="link to https://www.microsoft.com/en-us/edge" href="https://www.microsoft.com/en-us/edge">
    <Edge />
  </LogoLink>
);

export default EdgeLink;
