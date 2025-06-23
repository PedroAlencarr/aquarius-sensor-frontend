import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // Verificar se há token salvo no localStorage
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user_data");

    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Erro ao parsear dados do usuário:", error);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_data");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Fazer requisição para o endpoint de login do Better Auth
      const response = await fetch(
        `${process.env.REACT_APP_AUTH_URL}/api/auth/sign-in/email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Salvar dados do usuário
        const userData = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.name,
          role: data.user.role || "user",
        };

        localStorage.setItem("auth_token", data.token || "authenticated");
        localStorage.setItem("user_data", JSON.stringify(userData));

        setUser(userData);
        setIsAuthenticated(true);
        return true;
      } else {
        console.error("Erro no login:", response.status);
        return false;
      }
    } catch (error) {
      console.error("Erro de rede no login:", error);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string
  ): Promise<boolean> => {
    try {
      // Fazer requisição para o endpoint de registro do Better Auth
      const response = await fetch(
        `${process.env.REACT_APP_AUTH_URL}/api/auth/sign-up/email`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email, password, name }),
        }
      );

      if (response.ok) {
        console.log("Conta criada com sucesso!");
        return true;
      } else {
        console.error("Erro no registro:", response.status);
        return false;
      }
    } catch (error) {
      console.error("Erro de rede no registro:", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_data");
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
