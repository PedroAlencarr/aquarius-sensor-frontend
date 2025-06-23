import React from "react";
import UserHeader from "./UserHeader";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="app-container">
      <header>
        <div className="header-content">
          <div className="header-main">
            <h1>🌊 Aquarius Sensor System</h1>
            <p>Sistema de Monitoramento de Temperatura para Vacinas</p>
          </div>
          <UserHeader />
        </div>
      </header>
      <main className="main-content">{children}</main>
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Aquarius Sensor System</p>
          <p>Desenvolvido com ❤️ para monitoramento IoT</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
