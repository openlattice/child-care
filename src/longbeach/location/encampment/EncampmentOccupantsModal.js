// @flow

import React from 'react';

import { Modal } from 'lattice-ui-kit';

import EncampmentOccupants from './EncampmentOccupants';

type Props = {
  encampmentEKID :UUID
};

const EncampmentOccupantsModal = ({ encampmentEKID, ...props } :Props) => {
  return (
    <Modal
        {...props}
        textTitle="Occupants">
      <EncampmentOccupants encampmentEKID={encampmentEKID} />
    </Modal>
  );
};

export default EncampmentOccupantsModal;
