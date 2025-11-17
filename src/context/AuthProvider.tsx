import { useEffect, useState, type ReactNode } from "react";
import { AuthContext, type User } from "@context/auth-contex";

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/user", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("Not Authenticated");
        return res.json();
      })
      .then((data: User | null) => {
        if (!data) setUser(null);
        else {
          setUser({
            name: data.name,
            email: data.email,
            picture: data.picture,
            role: data.role,
          });
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
    <AuthContext.Provider
      value={{ isAuthenticated, loading, user, setUser, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};
