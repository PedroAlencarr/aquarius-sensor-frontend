import React from "react";
import "./App.css";
import AuthPage from "./components/AuthPage";
import Dashboard from "./components/Dashboard";
import Layout from "./components/Layout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <h1>🌊 Aquarius Sensor</h1>
          <div className="loading-spinner">🔄</div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
