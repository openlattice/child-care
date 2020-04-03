// @flow
import * as React from 'react';

import styled from 'styled-components';

const Headline = styled.div`
  font-weight: 600;
  font-size: 18px;
  margin-right: 10px;
`;

type Props = {
  headline :string;
  caption :string;
  isOpen :boolean;
};

const AccordionHeader = (props :Props) => {
  const { headline, caption, isOpen } = props;
  return (
    <>
      <Headline isOpen={isOpen}>
        {headline}
      </Headline>
      <div isOpen={isOpen}>
        {caption}
      </div>
    </>
  );
};

export default AccordionHeader;
