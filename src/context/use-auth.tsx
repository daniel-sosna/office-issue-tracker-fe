import { useContext } from "react";
import { AuthContext } from "@context/auth-contex";

export const useAuth = () => useContext(AuthContext);
