// @flow
import React from 'react';
import { Modal } from 'lattice-ui-kit';

type Props = {
  isVisible :boolean;
  onClickPrimary :() => void;
  onClose :() => void;
};

const DeleteModal = ({ isVisible, onClose, onClickPrimary } :Props) => {

  const message = 'Clicking on "Delete" will delete the current Crisis Report and return to the home screen.';
  return (
    <Modal
        appearance="danger"
        isVisible={isVisible}
        onClickPrimary={onClickPrimary}
        onClose={onClose}
        textPrimary="Delete"
        textSecondary="Cancel"
        textTitle="Delete Report">
      <div>
        <p>
          {message}
        </p>
        <p>
          This action cannot be undone.
        </p>
      </div>
    </Modal>
  );
};

export default DeleteModal;
