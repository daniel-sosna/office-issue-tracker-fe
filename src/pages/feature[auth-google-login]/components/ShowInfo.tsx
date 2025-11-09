import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from 'axios';

function ShowInfo() {

const {user, loading, isAuthenticated} = useAuth();


useEffect(() =>{
    if(!loading && isAuthenticated && user?.role === "ADMIN"){
        getInfo();
    } 
}, [loading, isAuthenticated, user]);

const getInfo = () =>{
    axios.get("http://localhost:8080/api/info", {withCredentials: true})
    .then(res => {
            console.log("admin info = ", res);
    })
    .catch(err => {
        console.log("err = ", err);
    });
};

if(user?.role === "USER"){
    return(
        <div
        style={{
            color: "red",
            fontSize: "40px",
            fontWeight: "bold",
            textAlign: "center",
            marginTop: "20px",
        }
        }>
            USER Page
        </div>
    )
}

  return (
    <div
    style={{
        color: "red",
        fontSize: "40px",
        fontWeight: "bold",
        textAlign: "center",
        marginTop: "20px",
    }}
    >Secured ADMIN Page
    </div>
  )
}

export default ShowInfo