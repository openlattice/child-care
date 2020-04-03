// @flow
import React from 'react';

import styled from 'styled-components';

const Headline = styled.div`
  font-size: 14px;
`;

type Props = {
  headline :string;
};

const AdvancedHeader = (props :Props) => {
  const { headline } = props;
  return (
    <Headline>
      {headline}
    </Headline>
  );
};

export default AdvancedHeader;
