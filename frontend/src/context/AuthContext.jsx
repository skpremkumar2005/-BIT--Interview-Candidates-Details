import { createContext, useState, useContext, useEffect } from 'react';

// Create a context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem('role') || null);

  useEffect(() => {
    localStorage.setItem('role', role); // Update localStorage when role changes
  }, [role]);

  const login = (userRole) => {
    setRole(userRole);
    localStorage.setItem('role', userRole); // Store role in localStorage
  };

  const logout = () => {
    setRole(null);
    localStorage.removeItem('role'); // Remove role from localStorage
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};
