import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Splash } from './pages/Splash';
import { Login } from './pages/Login';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <Splash onComplete={() => setShowSplash(false)} />;
  }

  return (
    <AuthProvider>
      <Login />
    </AuthProvider>
  );
};

export default App;