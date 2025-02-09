import React from 'react';
import { Route, useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
  requiredRole: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component, requiredRole, ...rest }) => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const userRole = userData.level;

  React.useEffect(() => {
    if (userRole !== requiredRole) {
      navigate('/unauthorized');
    }
  }, [userRole, requiredRole, navigate]);

  return (
    <Route
      {...rest}
      element={
        userRole === requiredRole ? <Component /> : null
      }
    />
  );
};

export default ProtectedRoute;
