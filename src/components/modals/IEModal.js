import React from 'react';
import styled from 'styled-components';
import { Modal } from 'lattice-ui-kit';

import { UNSUPPORTED_BROWSER } from '../../utils/constants/labels';

const Content = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  min-height: 200px;
  padding: 10px 0;
  width: 100%;
`;

const Text = styled.div`
  padding: 20px 0;

  &:first-child {
    font-weight: 600;
    text-align: center;
  }
`;

const IEModal = ({ getText }) => (
  <Modal withHeader={false} isVisible>
    <Content>
      <Text>
        {getText(UNSUPPORTED_BROWSER.HEADER)}
      </Text>
      <Text>
        {getText(UNSUPPORTED_BROWSER.SUGGESTION)}
      </Text>
    </Content>
  </Modal>
);

export default IEModal;
