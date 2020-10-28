// @flow

import React from 'react';
import type { Node, Element, ChildrenArray } from 'react';
import styled from 'styled-components';
import { Colors } from 'lattice-ui-kit';
import { faChevronUp, faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const { NEUTRAL } = Colors;

const Wrapper = styled.div`
  padding: 20px 0;
  width:  100%;
`;

const TitleRow = styled.div`
  align-items: center;
  color: ${NEUTRAL.N400};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: ${(props) => (props.isOpen ? 10 : 0)}px;
  width: 100%;

  span {
    color: ${NEUTRAL.N700};
    line-height: 17px;
    font-size: 14px;
    font-style: normal;
    font-weight: 600;
  }

  &:hover {
    cursor: pointer;
  }
`;

type Props = {
  children :Node | Element<*> | ChildrenArray<*>;
  title :string;
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
