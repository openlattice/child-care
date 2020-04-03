// @flow
import { useCallback } from 'react';

import { useDispatch } from 'react-redux';

import { goToPath } from '../../core/router/RoutingActions';

const useGoToPath = (to :string, state :any) => {
  const dispatch = useDispatch();
  return useCallback(() => dispatch(goToPath(to, state)), [dispatch, state, to]);
};

export default useGoToPath;
