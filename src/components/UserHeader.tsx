import React from "react";
import { useAuth } from "../contexts/AuthContext";

const UserHeader: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (!user) return null;

  return (
    <div className="user-header">
      <div className="user-info">
        <span className="user-greeting">👋 Olá, {user.name || user.email}</span>
        <span className="user-role">{user.role || "Usuário"}</span>
      </div>
      <button onClick={handleLogout} className="logout-button">
        🚪 Sair
      </button>
    </div>
  );
};

export default UserHeader;
