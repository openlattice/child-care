import React from 'react';

import styled from 'styled-components';
import { faHouse } from '@fortawesome/pro-light-svg-icons';
import { Hooks, IconSplash } from 'lattice-ui-kit';

import { useTimeout } from '../../components/hooks';
import { getRenderTextFn } from '../../utils/AppUtils';
import { LABELS } from '../../utils/constants/Labels';
import { useSelector } from 'react-redux';

const { useBoolean } = Hooks;

const Centered = styled.div`
  display: flex;
  flex: 1;
  align-items: center;
  justify-content: center;
  opacity: ${(props) => (props.hidden ? 0 : 1)};
`;

const WelcomeSplash = () => {
  const renderText = useSelector(getRenderTextFn);
  const [hidden, , reveal] = useBoolean(true);
  useTimeout(reveal, 10);

  return (
    <Centered hidden={hidden}>
      <IconSplash icon={faHouse} caption={renderText(LABELS.WELCOME_TEXT)} />
    </Centered>
  );
};

export default WelcomeSplash;
