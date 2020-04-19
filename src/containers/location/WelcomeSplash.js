import React from 'react';

import styled from 'styled-components';
import { faHouse } from '@fortawesome/pro-light-svg-icons';
import { Hooks, IconSplash } from 'lattice-ui-kit';

import { useTimeout } from '../../components/hooks';
import { getRenderTextFn } from '../../utils/AppUtils';
import { WELCOME_SPLASH } from '../../utils/constants/Labels';
import { useSelector } from 'react-redux';

const { useBoolean } = Hooks;

const Centered = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  opacity: ${(props) => (props.hidden ? 0 : 1)};
  padding:  15px 0;
`;

const TextSection = styled.span`
  text-align: center;
  color: #555E6F;
  font-size: 14px;
  font-weight: 300;
`;

const Header = styled(TextSection)`
   font-size:  20px;
   font-weight: 600;
`;

const Details = styled(TextSection)`
  padding: 30px 0;
`;

const Instructions = styled(TextSection)`


  span {
    color: #6124E2;
    text-decoration: underline;

    &:hover {
      cursor: pointer;
    }
  }
`;

const WelcomeSplash = ({ getCurrentPosition }) => {
  const renderText = useSelector(getRenderTextFn);
  const [hidden, , reveal] = useBoolean(true);
  useTimeout(reveal, 10);

  return (
    <Centered hidden={hidden}>
      <Header>{renderText(WELCOME_SPLASH.WELCOME)}</Header>
      <Details>{renderText(WELCOME_SPLASH.DETAILS)}</Details>
      <Instructions>
        {renderText(WELCOME_SPLASH.INSTRUCTIONS_1)}
        <span onClick={getCurrentPosition}>{renderText(WELCOME_SPLASH.USE_CURRENT_LOCATION_LINK )}</span>
        {renderText(WELCOME_SPLASH.INSTRUCTIONS_2)}
      </Instructions>
    </Centered>
  );
};

export default WelcomeSplash;
