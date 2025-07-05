// contexts/AuthContext.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";

type User = {
  name: string;
  email: string;
  // outros campos se quiser
};

type AuthContextType = {
  user: User | null;
  signIn: (userData: User) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const signIn = (userData: User) => setUser(userData);
  const signOut = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
