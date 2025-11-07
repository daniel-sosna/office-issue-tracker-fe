import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import { useEffect } from "react";

export const Login = () => {

  const {isAuthenticated} = useAuth();

  const navigate = useNavigate();
  const location = useLocation();

  const fromLocation = (location.state)?.from?.pathname || "/";

  useEffect(() => {
    if(isAuthenticated){
      navigate(fromLocation, {replace: true});
    }
  },[isAuthenticated, fromLocation, navigate])
  
  const handleLogin = (provider: string) => {
    if(provider == 'google'){
      window.location.href = 'http://localhost:8080/aouth2/authorization/google';
    }else return;
  }
 
return (
  <div className="flex flex-col items-center justify-center h-screen space-y-4">
    <h1 className="text-xl mb-4">Login Page</h1>

    {/* Google Login Button */}
    <button
      className="bg-white border border-gray-300 px-6 py-2 rounded flex items-center gap-2 cursor-pointer"
      onClick={() => handleLogin("google")}
    >
      <img
        src="https://developers.google.com/identity/images/g-logo.png"
        alt="Google"
        className="w-5 h-5"
      />
      Sign in with Google
    </button>
  </div>
);
};