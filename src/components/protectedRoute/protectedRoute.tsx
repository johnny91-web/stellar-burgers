import { useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import {
  selectIsAuthChecked,
  selectCurrentUser
} from '../../services/slices/userSlice';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  onlyUnAuth?: boolean;
  children: React.ReactNode;
}

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const user = useSelector(selectCurrentUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }
  // только для не авторизованных
  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from.pathname} replace />;
  }
  // только для авторизованных
  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
