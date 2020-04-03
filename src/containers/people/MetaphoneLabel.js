// @flow

import React from 'react';

import styled from 'styled-components';
import { faInfoCircle } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'lattice-ui-kit';

const MarginWrapper = styled.span`
  margin-left: 5px;
`;

const InfoIcon = React.forwardRef((props, ref) => (
  // https://material-ui.com/components/tooltips/#custom-child-element
  // eslint-disable-next-line react/jsx-props-no-spreading
  <span {...props} ref={ref}>
    <FontAwesomeIcon icon={faInfoCircle} fixedWidth />
  </span>
));

const MetaphoneLabel = (
  <span>
    Metaphone Analysis
    <MarginWrapper>
      <Tooltip
          arrow
          placement="top"
          title="Search by phonetic pronunciation">
        <InfoIcon />
      </Tooltip>
    </MarginWrapper>
  </span>
);

export default MetaphoneLabel;
