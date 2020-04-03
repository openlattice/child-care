// @flow
import React from 'react';

import styled from 'styled-components';
import { List, Map } from 'immutable';
import { Constants } from 'lattice';
import { IconSplash } from 'lattice-ui-kit';

import { UL } from '../../../components/layout';
import { TRIGGER_FQN } from '../../../edm/DataModelFqns';

const { OPENLATTICE_ID_FQN } = Constants;

const H2 = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px 0;
`;

type Props = {
  isLoading ?:boolean;
  triggers :List<Map>;
};

const Triggers = (props :Props) => {

  const { isLoading, triggers } = props;

  if (isLoading) return <UL isLoading />;

  let content = <IconSplash caption="No triggers." />;
  if (!triggers.isEmpty()) {
    content = (
      <UL>
        {
          triggers.map((trigger) => {
            const value :string = trigger.getIn([TRIGGER_FQN, 0], '');
            const triggerEKID :UUID = trigger.getIn([OPENLATTICE_ID_FQN, 0]);
            return <li key={triggerEKID}>{value}</li>;
          })
        }
      </UL>
    );
  }

  return (
    <>
      <H2>
        Triggers
      </H2>
      { content }
    </>
  );
};

Triggers.defaultProps = {
  isLoading: false
};

export default Triggers;
