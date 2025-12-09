import { createContext } from "react";

export interface User {
  name: string;
  email: string;
  picture?: string;
  role: "USER" | "ADMIN";
}

export interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: false,
  user: null,
  setUser: () => {
    throw new Error("setUser called outside of AuthProvider");
  },
  logout: () => {
    throw new Error("logout called outside of AuthProvider");
  },
  error: null,
});
