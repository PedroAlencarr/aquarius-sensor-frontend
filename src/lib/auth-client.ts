import { createAuthClient } from "better-auth/react";

const baseURL =
  process.env.REACT_APP_AUTH_URL ||
  process.env.REACT_APP_API_URL?.replace("/messages", "") ||
  "http://localhost:3000";

console.log("🔧 Auth Client URL:", baseURL);

export const authClient = createAuthClient({
  baseURL: baseURL,
  basePath: "/api/auth",
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
