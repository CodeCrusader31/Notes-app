import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";
import { useMutation } from "@tanstack/react-query";

import { queryClient } from "@/api/queryClient";
import { getApiErrorMessage } from "@/api/http";
import { authService } from "@/services/auth.service";
import type { AuthPayload, AuthResponse, AuthUser, StoredAuth } from "@/types/auth";
import { AUTH_STORAGE_KEY } from "@/utils/storage";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (payload: AuthPayload) => Promise<void>;
  register: (payload: AuthPayload) => Promise<void>;
  logout: () => void;
  isLoggingIn: boolean;
  isRegistering: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const readStoredAuth = (): StoredAuth | null => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredAuth;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

export function AuthProvider({ children }: PropsWithChildren) {
  const [auth, setAuth] = useState<StoredAuth | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    setAuth(readStoredAuth());
    setIsAuthReady(true);
  }, []);

  const persistAuth = useCallback((value: AuthResponse) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(value));
    setAuth(value);
  }, []);

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: persistAuth,
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: persistAuth,
  });

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setAuth(null);
    queryClient.clear();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user: auth?.user ?? null,
      token: auth?.token ?? null,
      isAuthenticated: Boolean(auth?.token),
      isAuthReady,
      login: async (payload) => {
        try {
          await loginMutation.mutateAsync(payload);
        } catch (error) {
          throw new Error(getApiErrorMessage(error));
        }
      },
      register: async (payload) => {
        try {
          await registerMutation.mutateAsync(payload);
        } catch (error) {
          throw new Error(getApiErrorMessage(error));
        }
      },
      logout,
      isLoggingIn: loginMutation.isPending,
      isRegistering: registerMutation.isPending,
    }),
    [auth, isAuthReady, loginMutation, logout, registerMutation],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextValue => {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return value;
};
