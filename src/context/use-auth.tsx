import { useContext } from "react";
import { AuthContext } from "@context/Auth-contex";

export const useAuth = () => useContext(AuthContext);
