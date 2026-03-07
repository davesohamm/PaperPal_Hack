"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
}

interface AuthContextType extends AuthState {
  signin: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (
    firstName: string,
    lastName: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    loading: true,
  });

  useEffect(() => {
    const stored = localStorage.getItem("paperpal_user");
    const storedToken = localStorage.getItem("paperpal_token");

    if (stored && storedToken) {
      try {
        const user = JSON.parse(stored) as User;
        setState({ user, token: storedToken, loading: false });

        fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${storedToken}` },
        })
          .then((r) => {
            if (!r.ok) throw new Error("expired");
            return r.json();
          })
          .then((data) => {
            setState({ user: data.user, token: storedToken, loading: false });
          })
          .catch(() => {
            localStorage.removeItem("paperpal_user");
            localStorage.removeItem("paperpal_token");
            setState({ user: null, token: null, loading: false });
          });
      } catch {
        setState({ user: null, token: null, loading: false });
      }
    } else {
      setState((s) => ({ ...s, loading: false }));
    }
  }, []);

  const signin = useCallback(
    async (
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, mode: "signin" }),
        });
        const data = await res.json();

        if (!data.success) {
          return { success: false, error: data.error };
        }

        localStorage.setItem("paperpal_user", JSON.stringify(data.user));
        localStorage.setItem("paperpal_token", data.token);
        setState({ user: data.user, token: data.token, loading: false });
        return { success: true };
      } catch {
        return { success: false, error: "Connection failed. Please try again." };
      }
    },
    []
  );

  const signup = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      password: string
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const res = await fetch("/api/auth", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, password, mode: "signup" }),
        });
        const data = await res.json();

        if (!data.success) {
          return { success: false, error: data.error };
        }

        localStorage.setItem("paperpal_user", JSON.stringify(data.user));
        localStorage.setItem("paperpal_token", data.token);
        setState({ user: data.user, token: data.token, loading: false });
        return { success: true };
      } catch {
        return { success: false, error: "Connection failed. Please try again." };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => {});
    localStorage.removeItem("paperpal_user");
    localStorage.removeItem("paperpal_token");
    setState({ user: null, token: null, loading: false });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signin,
        signup,
        logout,
        isLoggedIn: !!state.user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
