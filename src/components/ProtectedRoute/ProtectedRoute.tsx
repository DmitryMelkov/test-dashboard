// components/ProtectedRoute/ProtectedRoute.tsx
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { RootState } from '../../store';
import AuthModal from '../AuthModal/AuthModal';

const ProtectedRoute = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  if (!isAuthenticated) {
    return <AuthModal />;
  }

  return <Outlet />;
};

export default ProtectedRoute;