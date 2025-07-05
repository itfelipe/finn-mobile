import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Defina o tipo do usuário conforme sua API
export type User = {
  id?: number; // se houver
  name: string;
  email: string;
  accessToken: string;
  refreshToken?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signIn: (userData: User) => Promise<void>;
  signOut: () => Promise<void>;
  setUser: (user: User | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Carrega o usuário salvo ao abrir o app
  useEffect(() => {
    const loadStorage = async () => {
      try {
        const stored = await AsyncStorage.getItem("@user");
        if (stored) setUser(JSON.parse(stored));
      } finally {
        setLoading(false);
      }
    };
    loadStorage();
  }, []);

  // Salva e loga o usuário
  const signIn = async (userData: User) => {
    setUser(userData);
    await AsyncStorage.setItem("@user", JSON.stringify(userData));
  };

  // Seta (ou atualiza) manualmente o user
  const updateUser = async (user: User | null) => {
    setUser(user);
    if (user) {
      await AsyncStorage.setItem("@user", JSON.stringify(user));
    } else {
      await AsyncStorage.removeItem("@user");
    }
  };

  // Logout
  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem("@user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signIn,
        signOut,
        setUser: updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
