// @flow
import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

import { switchOrganization } from '../../containers/app/AppActions';

type Tuple = [string, boolean, (orgId :string) => void];

const useOrganization = () :Tuple => {
  const dispatch = useDispatch();
  const selectedOrganizationId = useSelector((state) => state.getIn(['app', 'selectedOrganizationId']));
  const initializeState = useSelector((state) => state.getIn(['app', 'initializeState']));
  const isLoading = initializeState === RequestStates.PENDING;

  const changeOrganization = useCallback((orgId :string) => {
    if (orgId !== selectedOrganizationId) {
      dispatch(switchOrganization(orgId));
    }
  }, [dispatch, selectedOrganizationId]);

  return [selectedOrganizationId, isLoading, changeOrganization];
};


export default useOrganization;
