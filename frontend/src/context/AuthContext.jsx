import { createContext, useState, useContext } from 'react';

// Create a context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);  // Store role (null, 'admin', or 'user')

  const login = (role) => setRole(role);  // Login function
  const logout = () => setRole(null);     // Logout function

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
