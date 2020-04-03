// @flow

import { useEffect, useState } from 'react';

import { List, Set } from 'immutable';
import { useSelector } from 'react-redux';
import { RequestStates } from 'redux-reqseq';

const useAuthorization = (feature :string, callback :any) => {
  const [isAuthorized, setAuthorization] = useState(false);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    callback();
  }, [callback]);

  const allowedPrincipals :List<string> = useSelector((state) => state
    .getIn(['app', 'selectedOrganizationSettings', 'private', feature]));

  const currentPrincipalIds :Set<string> = useSelector((state) => state
    .getIn(['authorization', 'currentPrincipalIds'])) || Set();

  const fetchState = useSelector((state) => state.getIn(['authorization', 'fetchState']));

  useEffect(() => {
    const loadState = fetchState === RequestStates.PENDING;

    if (!List.isList(allowedPrincipals)) {
      setAuthorization(true);
      setLoading(loadState);
    }
    else {
      const hasPrincipal = !!currentPrincipalIds.intersect(allowedPrincipals).count();
      setAuthorization(hasPrincipal);
      setLoading(loadState);
    }
  }, [allowedPrincipals, currentPrincipalIds, fetchState]);

  return [isAuthorized, isLoading];
};

export default useAuthorization;
