// @flow
import React from 'react';
import type { ChildrenArray } from 'react';

import styled from 'styled-components';
import { Step } from 'lattice-ui-kit';
import { Link, matchPath, withRouter } from 'react-router-dom';
import type { Location } from 'react-router-dom';

const StyledLink = styled(Link)`
  color: inherit;
  text-decoration: none;

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    text-decoration: none;
  }
`;

type Props = {
  children ? :ChildrenArray<any>;
  index ? :number;
  to :string;
  location :Location;
};

const NavStep = (props :Props) => {
  const {
    children,
    index,
    location,
    to,
  } = props;

  const isMatching = matchPath(location.pathname, to);

  return (
    <StyledLink to={to}>
      <Step active={!!isMatching} index={index}>{children}</Step>
    </StyledLink>
  );
};

NavStep.defaultProps = {
  children: null,
  index: 0,
};

export default withRouter(NavStep);
