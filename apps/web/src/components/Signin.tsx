"use client";

import { useState } from "react";
import { signIn, signOut, useSession } from "../lib/auth-client";

export function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { data: session, isPending } = useSession();

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn.email({
      email,
      password,
    });
  };

  const handleSocialLogin = (provider: "google" | "github" | "discord") => {
    signIn.social({
      provider,
    });
  };

  const handleSignOut = () => {
    signOut();
  };

  if (isPending) return <div>Loading...</div>;

  if (session) {
    return (
      <div>
        <p>Welcome, {session.user.email}!</p>
        <button onClick={handleSignOut}>Sign Out</button>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={handleEmailLogin}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        <button type="submit">Sign In</button>
      </form>

      <div>
        <button onClick={() => handleSocialLogin("google")}>
          Sign in with Google
        </button>
        <button onClick={() => handleSocialLogin("github")}>
          Sign in with GitHub
        </button>
        <button onClick={() => handleSocialLogin("discord")}>
          Sign in with Discord
        </button>
      </div>
    </div>
  );
}
