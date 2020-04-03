// @flow
import React from 'react';

import styled from 'styled-components';
import { Label, Skeleton } from 'lattice-ui-kit';

const LabeledDetailWrapper = styled.div`
  display: flex;
`;

const Content = styled.div`
  flex: 1;
  word-break: break-word;
  white-space: pre-wrap;
`;

const LabelHeader = styled(Label)`
  min-width: 90px;
`;

type Props = {
  className ? :string;
  content ? :string;
  label ? :string;
  isLoading ? :boolean;
}

const LabeledDetail = (props :Props) => {

  const {
    content,
    label,
    className,
    isLoading
  } = props;

  if (isLoading) {
    return <Skeleton />;
  }

  const display = content || '---';

  return (
    <LabeledDetailWrapper className={className}>
      <LabelHeader subtle>{label}</LabelHeader>
      <Content>
        {display}
      </Content>
    </LabeledDetailWrapper>
  );
};

LabeledDetail.defaultProps = {
  className: undefined,
  content: '',
  label: '',
  isLoading: false
};

export default LabeledDetail;
