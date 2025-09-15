import { useAuth } from '@/shared/hooks/useAuth';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const FullPageSpinner = () => (
  <div className="h-screen flex justify-center items-center">
    <div className="text-center">
      <p className="text-lg font-semibold">인증 정보를 확인하는 중입니다...</p>
      <p className="text-gray-500">잠시만 기다려주세요.</p>
    </div>
  </div>
);

const PrivateRoute = () => {
  const { isAuthenticated, isAuthenticating } = useAuth();
  const location = useLocation();

  if (isAuthenticating) {
    return <FullPageSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
