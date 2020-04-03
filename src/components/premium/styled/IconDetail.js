// @flow
import React, { Component } from 'react';

import isPlainObject from 'lodash/isPlainObject';
import styled from 'styled-components';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Skeleton } from 'lattice-ui-kit';

const IconDetailWrapper = styled.div`
  display: flex;
`;

const Content = styled.div`
  flex: 1;
  word-break: break-word;
  white-space: pre-wrap;
`;

const IconWrapper = styled.span`
  align-items: center;
  margin-right: 10px;
`;

type Props = {
  className ? :string;
  content ? :string;
  icon ? :IconDefinition;
  isLoading ? :boolean;
}

class IconDetail extends Component<Props> {
  static defaultProps = {
    className: undefined,
    content: '',
    icon: undefined,
    isLoading: false
  };

  renderContent = () => {
    const { content, icon } = this.props;
    const display = content || '---';
    return (
      <>
        {
          isPlainObject(icon) && (
            <IconWrapper>
              <FontAwesomeIcon icon={icon} fixedWidth />
            </IconWrapper>
          )
        }
        <Content>
          {display}
        </Content>
      </>
    );
  }

  render() {
    const { className, isLoading } = this.props;

    if (isLoading) {
      return <Skeleton />;
    }

    return (
      <IconDetailWrapper className={className}>
        { this.renderContent() }
      </IconDetailWrapper>
    );
  }
}

export default IconDetail;
