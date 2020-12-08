// @flow

import React from 'react';
import type { ChildrenArray, Element, Node } from 'react';

import styled from 'styled-components';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Typography } from 'lattice-ui-kit';

import { Wrapper } from '../../styled';

const TitleRow = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-bottom: ${(props) => (props.isOpen ? 10 : 0)}px;
  width: 100%;

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
          <Typography textPrimary variant="subtitle2">{title}</Typography>
          <FontAwesomeIcon icon={icon} />
        </TitleRow>
        {isOpen ? children : null}
      </Wrapper>
    );
  }
}
