import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { signOut } from "../lib/auth-client";

const UserHeader: React.FC = () => {
  const { user } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      window.location.reload(); // Recarrega para limpar o estado
    } catch (error) {
      console.error("Logout error:", error);
    }
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
