// @flow
import React, { Component } from 'react';

import isPlainObject from 'lodash/isPlainObject';
import styled, { css } from 'styled-components';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Colors, Skeleton } from 'lattice-ui-kit';

const { NEUTRAL } = Colors;

const IconDetailWrapper = styled.div`
  display: flex;
  ${(props) => (props.fitContent ? css`min-width: fit-content;` : '')}
`;

const Content = styled.div`
  flex: 1;
  word-break: break-word;
  white-space: pre-wrap;
  color: ${(props) => (props.isInactive ? NEUTRAL.N400 : NEUTRAL.N700)};
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
  isInactive ? :boolean;
  fitContent ? :boolean;
}

class IconDetail extends Component<Props> {
  static defaultProps = {
    className: undefined,
    content: '',
    icon: undefined,
    isLoading: false,
    isInactive: false,
    fitContent: false
  };

  renderContent = () => {
    const { content, icon, isInactive } = this.props;
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
        <Content isInactive={isInactive}>
          {display}
        </Content>
      </>
    );
  }

  render() {
    const { className, isLoading, fitContent } = this.props;

    if (isLoading) {
      return <Skeleton />;
    }

    return (
      <IconDetailWrapper className={className} fitContent={fitContent}>
        { this.renderContent() }
      </IconDetailWrapper>
    );
  }
}

export default IconDetail;
