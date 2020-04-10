// @flow

import React from 'react';
import styled from 'styled-components';
import { faChevronUp, faChevronDown } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Wrapper = styled.div`
  width:  100%;
`;

const TitleRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  color: #8E929B;
  width: 100%;
  padding: 20px 0;

  span {
    color: #555E6F;
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    font-size: 14px;
    line-height: 17px;
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

  constructor(props) {
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
        <TitleRow onClick={() => this.setState({ isOpen: !isOpen })}>
          <span>{title}</span>
          <FontAwesomeIcon icon={icon} />
        </TitleRow>
        {isOpen ? children : null}
      </Wrapper>
    );
  }
}
