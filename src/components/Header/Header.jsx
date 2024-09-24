import React, { useEffect } from 'react';
import "./Header.css"; 
import { auth } from '../../firebase.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useNavigate } from 'react-router-dom';
import { getAuth, signOut } from "firebase/auth";
import { toast } from 'react-toastify';
import userImg from "../../assets/user.svg";

function Header (){
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() =>{
    if(user){
      navigate("/dashboard");
    }
  },[user,loading]);

  function logoutFuc(){
    try{
        signOut(auth)
        .then(() => {
          // Sign-out successful.
          toast.success("Logged Out Successfully!");
          navigate("/");
        })
        .catch((error) => {
          toast.error(error.message);
          // An error happened.
        });
    } catch(e){
      toast.error(e.message);
    }
  }

  
  return (
   <div className="navbar"> 
    <p className="logo"> Budgetbuddy. </p>
    {user && (
      <div div style={{ display : "flex", alignItems : "center", gap : "0.75rem"}}>
          <img
            src={user.photoURL ? user.photoURL : userImg}
            style={{borderRadius : "50%" , height : "2rem" , width : "2rem"}}
          />
          <p className="logo link" onClick={logoutFuc}>
          Logout
          </p> 
      </div>
    )}
   </div>
  );
}

export default Header;