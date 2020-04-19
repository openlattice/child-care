import React from 'react';
import styled from 'styled-components';
import { Modal } from 'lattice-ui-kit';

import { UNSUPPORTED_BROWSER } from '../../utils/constants/Labels';

const Content = styled.div`
  height: 100%;
  min-height: 200px;
  width: 100%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding: 10px 0;
`;

const Text = styled.div`
  padding: 20px 0;

  &:first-child {
    font-weight: 600;
    text-align: center;
  }
`;

const IEModal = ({ renderText }) => {

  return (
    <Modal withHeader={false} isVisible>
      <Content>
        <Text>
          {renderText(UNSUPPORTED_BROWSER.HEADER)}
        </Text>
        <Text>
          {renderText(UNSUPPORTED_BROWSER.SUGGESTION)}
        </Text>
      </Content>
    </Modal>
  );
}

export default IEModal;
