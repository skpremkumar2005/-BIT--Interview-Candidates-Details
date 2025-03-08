import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Protected route that checks for the required role
const ProtectedRoute = ({ requiredRole }) => {
  const { role } = useAuth();  
  const storedRole = localStorage.getItem('role'); // Retrieve role from localStorage

  if (!storedRole || storedRole !== requiredRole) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
