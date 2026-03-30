"use client";

/**
 * ClerkAuthProvider — only ever mounted when ClerkProvider is present.
 * Reads Clerk's useUser/useClerk and feeds the result into AuthContext.
 */

import { ReactNode } from "react";
import { useUser, useClerk } from "@clerk/nextjs";
import { AuthContext } from "./AuthContext";

export function ClerkAuthProvider({ children }: { children: ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const isPro = isLoaded && (user?.publicMetadata?.tier as string) === "pro";
  const email = user?.primaryEmailAddress?.emailAddress ?? null;

  return (
    <AuthContext.Provider value={{ isLoaded, isSignedIn: !!isSignedIn, isPro, email, openSignIn }}>
      {children}
    </AuthContext.Provider>
  );
}
