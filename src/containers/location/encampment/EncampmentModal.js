// @flow
import React, { useCallback, useEffect, useRef } from 'react';

import { Map } from 'immutable';
import { ActionModal } from 'lattice-ui-kit';
import { useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import EncampmentForm from './EncampmentForm';
import { ENCAMPMENT_STORE_PATH } from './constants';

const emptyBody = {
  [RequestStates.PENDING]: <></>,
  [RequestStates.SUCCESS]: <></>,
  [RequestStates.FAILURE]: <></>,
  [RequestStates.STANDBY]: <></>,
};

type Props = {
  currentUser :Map;
  edit ?:boolean;
  encampment ?:Map;
  encampmentLocation :?Map;
  isVisible :boolean;
  onClose :() => void;
};

const EncampmentModal = (props :Props) => {
  const {
    edit,
    encampment,
    encampmentLocation,
    isVisible,
    onClose,
  } = props;
  const formRef = useRef();

  const currentUser :Map = useSelector((store :Map) => store.getIn(['staff', 'currentUser', 'data'])) || Map();
  const requestState :RequestState = useSelector((store) => {
    const stateName = edit ? 'updateState' : 'submitState';
    return store.getIn([...ENCAMPMENT_STORE_PATH, stateName]);
  });

  useEffect(() => {
    if (requestState === RequestStates.SUCCESS) {
      onClose();
    }
  }, [onClose, requestState]);

  const handleExternalSubmit = useCallback(() => {
    if (formRef.current) {
      formRef.current.submit();
    }
  }, [formRef]);

  const textPrimary = edit ? 'Update' : 'Submit';
  const textTitle = edit ? 'Edit Encampment' : 'Create Encampment';

  return (
    <ActionModal
        requestState={requestState}
        requestStateComponents={emptyBody}
        isVisible={isVisible}
        onClickPrimary={handleExternalSubmit}
        onClose={onClose}
        shouldCloseOnOutsideClick={false}
        textPrimary={textPrimary}
        textSecondary="Discard"
        textTitle={textTitle}
        viewportScrolling>
      <EncampmentForm
          currentUser={currentUser}
          edit={edit}
          encampment={encampment}
          encampmentLocation={encampmentLocation}
          ref={formRef} />
    </ActionModal>
  );
};

EncampmentModal.defaultProps = {
  edit: false,
  encampment: Map(),
  encampmentLocation: Map(),
};

export default React.memo<Props>(EncampmentModal);
