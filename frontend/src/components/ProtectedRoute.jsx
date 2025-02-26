import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protected route that checks for the required role
const ProtectedRoute = ({ requiredRole }) => {
  const { role } = useAuth();  // Get the current user role

  if (role !== requiredRole) {
    // If the user doesn't have the required role, redirect to login
    return <Navigate to="/" />;
  }

  return <Outlet />;  // Render the protected routes if the role is valid
};

export default ProtectedRoute;
