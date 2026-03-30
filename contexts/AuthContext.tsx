"use client";

/**
 * AuthContext wraps Clerk auth and provides safe fallbacks when
 * Clerk keys are not configured (local dev without keys, CI, etc.).
 */

import { createContext, useContext, ReactNode } from "react";

export interface AuthState {
  isLoaded: boolean;
  isSignedIn: boolean;
  isPro: boolean;
  email: string | null;
  openSignIn: () => void;
}

const defaultState: AuthState = {
  isLoaded: true,
  isSignedIn: false,
  isPro: false,
  email: null,
  openSignIn: () => {},
};

export const AuthContext = createContext<AuthState>(defaultState);

export function useAuthContext(): AuthState {
  return useContext(AuthContext);
}

// ── NoAuthProvider — used when Clerk is not configured ────────────────────
export function NoAuthProvider({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={defaultState}>
      {children}
    </AuthContext.Provider>
  );
}
