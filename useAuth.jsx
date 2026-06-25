// React auth context for BeMyFriend.
// Wrap your app: <AuthProvider><App/></AuthProvider>
// Then use: const { user, status, startLogin, verifyLogin, logout } = useAuth();

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { api } from "./api";

const AuthCtx = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | signed_out | signed_in

  // On mount, if we have a token, fetch the current user.
  useEffect(() => {
    let active = true;
    (async () => {
      if (!api.isAuthed()) { setStatus("signed_out"); return; }
      try {
        const { user } = await api.me();
        if (active) { setUser(user); setStatus("signed_in"); }
      } catch {
        if (active) { setStatus("signed_out"); }
      }
    })();
    return () => { active = false; };
  }, []);

  // Step 1: send OTP. Returns { challengeId, devCode? }.
  const startLogin = useCallback((email, phone) => api.authStart(email, phone), []);

  // Step 2: verify OTP. Sets the session and returns { isNewUser }.
  const verifyLogin = useCallback(async (challengeId, code) => {
    const { user, isNewUser } = await api.authVerify(challengeId, code);
    setUser(user);
    setStatus("signed_in");
    return { isNewUser };
  }, []);

  const refreshUser = useCallback(async () => {
    const { user } = await api.me();
    setUser(user);
    return user;
  }, []);

  const logout = useCallback(async () => {
    await api.logout();
    setUser(null);
    setStatus("signed_out");
  }, []);

  const value = { user, status, startLogin, verifyLogin, refreshUser, logout, api };
  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthCtx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
