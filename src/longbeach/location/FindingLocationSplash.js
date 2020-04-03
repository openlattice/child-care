import React from 'react';

import styled from 'styled-components';
import { faLocationSlash } from '@fortawesome/pro-light-svg-icons';
import { Hooks, IconSplash } from 'lattice-ui-kit';

import { useTimeout } from '../../components/hooks';

const { useBoolean } = Hooks;

const Centered = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.hidden ? 0 : 1)};
`;

const FindingLocationSplash = () => {
  const [hidden, , reveal] = useBoolean(true);
  useTimeout(reveal, 200);

  return (
    <Centered hidden={hidden}>
      <IconSplash icon={faLocationSlash} caption="Finding location. Please ensure location services are enabled" />
    </Centered>
  );
};

export default FindingLocationSplash;
