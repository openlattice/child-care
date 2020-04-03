// @flow
import React, { useCallback, useEffect, useRef } from 'react';

import { Map } from 'immutable';
import { ActionModal } from 'lattice-ui-kit';
import { useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

import IssueForm from './IssueForm';

const emptyBody = {
  [RequestStates.PENDING]: <></>,
  [RequestStates.SUCCESS]: <></>,
  [RequestStates.FAILURE]: <></>,
  [RequestStates.STANDBY]: <></>,
};

type Props = {
  assignee :Map;
  currentUser :Map;
  defaultComponent ?:string;
  edit ?:boolean;
  issue ?:Map;
  isVisible :boolean;
  onClose :() => void;
  person :Map;
};

const IssueModal = (props :Props) => {
  const {
    assignee,
    currentUser,
    defaultComponent,
    edit,
    issue,
    isVisible,
    onClose,
    person,
  } = props;
  const formRef = useRef();

  const requestState :RequestState = useSelector((store) => {
    const stateName = edit ? 'updateState' : 'submitState';
    return store.getIn(['issues', 'issue', stateName]);
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
  const textTitle = edit ? 'Edit Issue' : 'Create Issue';

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
      <IssueForm
          assignee={assignee}
          currentUser={currentUser}
          defaultComponent={defaultComponent}
          edit={edit}
          issue={issue}
          person={person}
          ref={formRef} />
    </ActionModal>
  );
};

IssueModal.defaultProps = {
  defaultComponent: '',
  edit: false,
  issue: Map()
};

export default React.memo<Props>(IssueModal);
