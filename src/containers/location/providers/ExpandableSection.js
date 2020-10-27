// @flow

import React from 'react';
import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';
import { faChevronUp, faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const { NEUTRAL } = Colors;

const Wrapper = styled.div`
  width:  100%;
  padding: 20px 0;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: ${NEUTRAL.N400};
  width: 100%;
  padding-bottom: ${(props) => (props.isOpen ? 10 : 0)}px;

  span {
    color: ${NEUTRAL.N700};
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
  }

  &:hover {
    cursor: pointer;
  }
`;

type Props = {
  title :string;
  children :Node;
}

type State = {
  isOpen :boolean;
}

export default class ExpandableSection extends React.Component<Props, State> {

  constructor(props :Props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  render() {
    const { isOpen } = this.state;
    const { title, children } = this.props;

    const icon = isOpen ? faChevronUp : faChevronDown;

    return (
      <Wrapper>
        <TitleRow isOpen={isOpen} onClick={() => this.setState({ isOpen: !isOpen })}>
          <span>{title}</span>
          <FontAwesomeIcon icon={icon} />
        </TitleRow>
        {isOpen ? children : null}
      </Wrapper>
    );
  }
}
