// @flow
import { useEffect } from 'react';

import { useRouteMatch } from 'react-router';

import { PROFILE_ID_PARAM } from '../../core/router/Routes';

type Callback = (entityKeyId :?UUID) => void;

const usePeopleRoute = (callback :Callback) => {
  const match = useRouteMatch();
  const { [PROFILE_ID_PARAM]: profileId } = match.params;
  useEffect(() => {
    callback(profileId);
  }, [callback, profileId]);
};

export default usePeopleRoute;
