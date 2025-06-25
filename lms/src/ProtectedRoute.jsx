import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

const ProtectedRoute = ({ roles, children }) => {
  const { auth } = useContext(AuthContext);

  if (!auth.token || !auth.user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(auth.user.currentRole)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;
