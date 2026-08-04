import React, { createContext, useContext, useState, useMemo, useCallback } from "react";
import type { Account } from "@/data/accounts";
import { findAccount, accountByUsername } from "@/data/accounts";
import { readValue, writeValue, removeValue } from "./storage";

const SESSION_KEY = "session";

interface StoredSession {
  username: string;
  signedInAt: string;
}

interface AuthContextValue {
  account: Account | null;
  signedInAt: string | null;
  login: (username: string, password: string) => { ok: true } | { ok: false; error: string };
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function restoreSession(): { account: Account; signedInAt: string } | null {
  const stored = readValue<StoredSession | null>(SESSION_KEY, null);
  if (!stored?.username) return null;
  const account = accountByUsername(stored.username);
  if (!account) return null;
  return { account, signedInAt: stored.signedInAt };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<{ account: Account | null; signedInAt: string | null }>(() => {
    const restored = restoreSession();
    return restored
      ? { account: restored.account, signedInAt: restored.signedInAt }
      : { account: null, signedInAt: null };
  });

  const login = useCallback((username: string, password: string) => {
    const account = findAccount(username, password);
    if (!account) {
      return { ok: false as const, error: "Identifiant ou mot de passe invalide." };
    }
    const signedInAt = new Date().toISOString();
    writeValue<StoredSession>(SESSION_KEY, { username: account.username, signedInAt });
    setState({ account, signedInAt });
    return { ok: true as const };
  }, []);

  const logout = useCallback(() => {
    removeValue(SESSION_KEY);
    setState({ account: null, signedInAt: null });
  }, []);

  const value = useMemo(
    () => ({ account: state.account, signedInAt: state.signedInAt, login, logout }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return ctx;
}
