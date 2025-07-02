// src/App.js
import React from 'react';
import Header from './components/Header';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './context/AuthContext';
import './App.css';

const App = () => {

  return (
    <AuthProvider>
      <Header />
      <main>
        <AppRoutes />
      </main>
    </AuthProvider>
  );
};

export default App;
