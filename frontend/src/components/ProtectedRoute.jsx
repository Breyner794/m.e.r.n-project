import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  
  useEffect(() => {
    if (!token) {
      window.location.href = '/login';
    }
  }, [token]);

  if (!token) {
    return null;
  }

  return children;
};

export default ProtectedRoute;