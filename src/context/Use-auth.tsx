import { useContext } from "react";
import { AuthContext } from "@context/Auth-context";

export const useAuth = () => useContext(AuthContext);
