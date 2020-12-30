/*
 * @flow
 */
import React from 'react';

import CaGov from './CaGov';

import { LogoLink } from '../layout';

const CaGovLink = () => (
  <LogoLink aria-label="link to https://www.ca.gov/." href="https://www.ca.gov/.">
    <CaGov />
  </LogoLink>
);

export default CaGovLink;
