// @flow
import React from 'react';
import { Modal } from 'lattice-ui-kit';

type Props = {
  isVisible :boolean;
  onClickPrimary :() => void;
  onClose :() => void;
};

const DiscardModal = ({ isVisible, onClose, onClickPrimary } :Props) => {

  // eslint-disable-next-line max-len
  const message = 'Clicking on "Discard" will discard any changes made to the current Crisis Report and return to the home screen.';
  return (
    <Modal
        appearance="warning"
        isVisible={isVisible}
        onClickPrimary={onClickPrimary}
        onClose={onClose}
        textPrimary="Discard"
        textSecondary="Cancel"
        textTitle="Discard Changes">
      <div>
        <p>
          {message}
        </p>
      </div>
    </Modal>
  );
};

export default DiscardModal;
