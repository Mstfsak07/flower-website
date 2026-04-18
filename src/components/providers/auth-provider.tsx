"use client";

import {
  createContext,
  startTransition,
  useContext,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

import { getDefaultRouteByRole, sanitizeRedirectPath } from "@/lib/auth";
import { storage } from "@/lib/storage";
import type { AuthUser } from "@/lib/types";

type AuthResponse = {
  redirectTo: string;
  user: AuthUser;
};

type LoginInput = {
  email: string;
  password: string;
  redirectTo?: string;
};

type RegisterInput = {
  name: string;
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (input: LoginInput) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  register: (input: RegisterInput) => Promise<AuthResponse>;
};

const AuthContext = createContext<AuthContextValue | null>(null);
const AUTH_USER_KEY = "cicekci-auth-user";

async function readJson<T>(response: Response): Promise<T> {
  return (await response.json()) as T;
}

function persistUser(user: AuthUser | null) {
  if (!user) {
    storage.removeItem(AUTH_USER_KEY);
    return;
  }

  storage.setJson(AUTH_USER_KEY, user);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(() => storage.getJson<AuthUser>(AUTH_USER_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      try {
        const response = await fetch("/api/auth/session", {
          cache: "no-store",
          credentials: "same-origin",
        });
        const body = await readJson<{ data: AuthUser | null }>(response);
        setUser(body.data);
        persistUser(body.data);
      } catch {
        setUser(null);
        persistUser(null);
      } finally {
        setLoading(false);
      }
    }

    bootstrap().catch(() => {
      setUser(null);
      persistUser(null);
      setLoading(false);
    });
  }, []);

  async function login(input: LoginInput) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(input),
    });
    const body = await readJson<{ data?: AuthResponse; message?: string }>(response);

    if (!response.ok || !body.data) {
      throw new Error(body.message ?? "Giris basarisiz.");
    }

    const authData = body.data;

    setUser(authData.user);
    persistUser(authData.user);

    const target = sanitizeRedirectPath(
      authData.redirectTo,
      getDefaultRouteByRole(authData.user.role),
    );

    startTransition(() => {
      router.replace(target);
      router.refresh();
    });

    return authData;
  }

  async function register(input: RegisterInput) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
      body: JSON.stringify(input),
    });
    const body = await readJson<{ data?: AuthResponse; message?: string }>(response);

    if (!response.ok || !body.data) {
      throw new Error(body.message ?? "Kayit basarisiz.");
    }

    const authData = body.data;

    setUser(authData.user);
    persistUser(authData.user);

    startTransition(() => {
      router.replace(authData.redirectTo);
      router.refresh();
    });

    return authData;
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "same-origin",
    });

    setUser(null);
    persistUser(null);

    startTransition(() => {
      router.replace("/giris");
      router.refresh();
    });
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(user),
        loading,
        login,
        logout,
        register,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return value;
}
