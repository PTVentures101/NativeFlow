"use client";

import { useUser, SignInButton, UserButton } from "@clerk/nextjs";

export function AuthButtons() {
  const { isSignedIn, isLoaded } = useUser();

  if (!isLoaded) return null;

  return isSignedIn ? (
    <UserButton appearance={{ elements: { avatarBox: "w-7 h-7" } }} />
  ) : (
    <SignInButton mode="modal">
      <button className="text-xs font-medium px-3 py-1.5 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white transition-colors">
        Sign in
      </button>
    </SignInButton>
  );
}
