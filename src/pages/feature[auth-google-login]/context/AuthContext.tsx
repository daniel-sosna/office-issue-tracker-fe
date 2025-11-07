import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type AuthContextType = {
    isAuthenticated: boolean;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    loading: false,
});

export const useAuth = () => useContext(AuthContext);

type Props = {
    children: ReactNode;
};

export const AuthProvider = ({children}: Props) => {

    const[loading, setLoading] = useState(true);
    const[isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        fetch("http://localhost:8080/api/user",{
            credentials: "include", 

        })
        .then(data => {
            console.log("data = ", data);
            setIsAuthenticated(true);
        })
        .catch((e) => console.log("error = ", e))
        .finally(() => setLoading(false));
    }, []);
    

    return(
        <AuthContext.Provider value={{isAuthenticated, loading}}>
            {children}
        </AuthContext.Provider>
    )
}