import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSwitchToRegister }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    console.log("🚀 Tentando login para:", email);

    const success = await login(email, password);

    if (success) {
      console.log("✅ Login bem-sucedido!");
      // O contexto já atualizou o estado, não precisa recarregar a página
    } else {
      setError("Email ou senha incorretos");
    }

    setIsLoading(false);
  };

  return (
    <div className="auth-form">
      <div className="auth-header">
        <h2>🔐 Login</h2>
        <p>Acesse o sistema de monitoramento</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form-content">
        {error && <div className="error-message">⚠️ {error}</div>}

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="seu@email.com"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Sua senha"
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? "🔄 Entrando..." : "🚀 Entrar"}
        </button>

        <div className="auth-switch">
          <p>
            Não tem uma conta?{" "}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="switch-link"
            >
              Criar conta
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
