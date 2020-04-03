// @flow
import { AuthActions } from 'lattice-auth';
import { useDispatch } from 'react-redux';

const { logout } = AuthActions;

const Logout = () => {
  const dispatch = useDispatch();
  dispatch(logout());

  return null;
};

export default Logout;
