import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onSwitchToLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres");
      setIsLoading(false);
      return;
    }

    console.log("🚀 Tentando criar conta para:", email);

    const success = await register(email, password, name);

    if (success) {
      setSuccess("Conta criada com sucesso! Você pode fazer login agora.");
      // Limpar formulário
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setName("");
      // Mudar para login após alguns segundos
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
    } else {
      setError("Erro ao criar conta. Tente novamente.");
    }

    setIsLoading(false);
  };

  return (
    <div className="auth-form">
      <div className="auth-header">
        <h2>📝 Criar Conta</h2>
        <p>Registre-se para acessar o sistema</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form-content">
        {error && <div className="error-message">⚠️ {error}</div>}

        {success && <div className="success-message">✅ {success}</div>}

        <div className="form-group">
          <label htmlFor="name">Nome:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Seu nome completo"
            disabled={isLoading}
          />
        </div>

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
            placeholder="Mínimo 6 caracteres"
            disabled={isLoading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirmar Senha:</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Digite a senha novamente"
            disabled={isLoading}
          />
        </div>

        <button type="submit" className="auth-button" disabled={isLoading}>
          {isLoading ? "🔄 Criando..." : "✨ Criar Conta"}
        </button>

        <div className="auth-switch">
          <p>
            Já tem uma conta?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="switch-link"
            >
              Fazer login
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
