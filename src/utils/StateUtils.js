import has from 'lodash/has';
// @flow
import isString from 'lodash/isString';
import { RequestStates } from 'redux-reqseq';
import type { RequestState } from 'redux-reqseq';

const isRequestState = (requestState :string) :boolean => isString(requestState) && has(RequestStates, requestState);

// Reduce an array of RequestStates by the following priorities:
// 1) return undefined if ANY are not RequestStates
// 2) return RequestState.FAILURE if ANY are FAILURE
// 3) return RequestState.PENDING if ANY are PENDING
// 4) return RequestState.SUCCESS if ALL are SUCCESS
// 5) return RequestState.STANDBY if ALL are STANDBY

const reduceRequestStates = (requestStates :RequestState[]) => requestStates
  .reduce((acc, state) :RequestState | void => {
    if (acc === undefined || !isRequestState(state)) {
      return undefined;
    }

    if (state === RequestStates.FAILURE) {
      return RequestStates.FAILURE;
    }

    if (state === RequestStates.PENDING || acc === RequestStates.PENDING) {
      return RequestStates.PENDING;
    }

    if (state === RequestStates.SUCCESS && acc === RequestStates.SUCCESS) {
      return RequestStates.SUCCESS;
    }

    return RequestStates.STANDBY;
  });

export {
  // eslint-disable-next-line import/prefer-default-export
  reduceRequestStates
};
