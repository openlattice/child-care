// @flow

import React from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import { Constants } from 'lattice';

import * as FQN from '../../../edm/DataModelFqns';
import { DashedList } from '../../layout';

const { OPENLATTICE_ID_FQN } = Constants;

const H2 = styled.h2`
  font-size: 16px;
  font-weight: 600px;
  margin: 5px 0;
`;

type Props = {
  officerSafety :List<Map>;
  isLoading ?:boolean;
};

const OfficerSafetyConcernsList = (props :Props) => {
  const { isLoading, officerSafety } = props;

  let content = null;
  if (!isLoading) {
    content = officerSafety.map((concern :Map) => {
      const category = concern.getIn([FQN.CATEGORY_FQN, 0], '');
      const description = concern.getIn([FQN.DESCRIPTION_FQN, 0], '');
      const entityKeyId = concern.getIn([OPENLATTICE_ID_FQN, 0]);

      return (
        <div key={entityKeyId}>
          <H2>{category}</H2>
          {description}
        </div>
      );
    });
  }

  return (
    <DashedList isLoading={isLoading}>
      { content }
    </DashedList>
  );
};

OfficerSafetyConcernsList.defaultProps = {
  isLoading: false
};

export default OfficerSafetyConcernsList;
