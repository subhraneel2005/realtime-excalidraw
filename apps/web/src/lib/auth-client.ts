import { createAuthClient } from "better-auth/react";
import { type BetterAuthOptions } from "better-auth";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_BASE_URL,
});

export const {
  signIn,
  signUp,
  useSession,
  getAccessToken,
  getSession,
  signOut,
} = authClient;
