/*
 * @flow
 */
import React from 'react';

import CDSS from './CDSS';

import { LogoLink } from '../layout';

const CDSSLink = () => (
  <LogoLink aria-label="link to https://www.cdss.ca.gov/" href="https://www.cdss.ca.gov/">
    <CDSS />
  </LogoLink>
);

export default CDSSLink;
