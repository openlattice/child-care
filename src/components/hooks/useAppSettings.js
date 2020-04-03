// @flow
import { useSelector } from 'react-redux';
import type { Map } from 'immutable';

const useAppSettings = () => {
  const settings :Map = useSelector((state) => state
    .getIn(['app', 'selectedOrganizationSettings']));

  return settings;
};

export default useAppSettings;
