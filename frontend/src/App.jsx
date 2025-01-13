/* import React from 'react';
import { AuthProvider } from './context/AuthContext.jsx';
import Login from './components/Login.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

const App = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Login />
        </div>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App; */

import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const renderRoute = () => {
    switch (currentPath) {
      case '/dashboard':
        return (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        );
      case '/login':
      default:
        return <Login />;
    }
  };

  return (
    <AuthProvider>
      {renderRoute()}
    </AuthProvider>
  );
}

export default App;