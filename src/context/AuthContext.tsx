import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type User = {
  name: string;
  email: string;
  picture?: string;
  role: 'USER' | 'ADMIN';
}

type AuthContextType = {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  loading: false,
  user: null,
  setUser: () => { },
  error: null,
});

export const useAuth = () => useContext(AuthContext);

type Props = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not Authenticated");
        return res.json();
      })
      .then((data) => {
        if (!data) {
          setUser(null);
        } else {
          setUser({
            name: data.name,
            email: data.email,
            picture: data?.picture,
            role: data.role,
          })
        }
      })
      .catch(() => {
        setError("Failed to load user information. Please try again.");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, user, setUser, error }}>
      {children}
    </AuthContext.Provider>
  )
}