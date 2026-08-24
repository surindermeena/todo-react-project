import React, { useEffect, useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import "../style/App.css";

const Login = () => {
  const [userData, setUserData] = useState();
  const navigate = useNavigate();

  useEffect(()=>{
    if(localStorage.getItem('login')){
      navigate("/");
    }
  },[]);


  const handleLogin = async () => {
    let result = await fetch("http://localhost:3200/login", {
      method: "Post",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "Application/Json",
      },
    });
    result = await result.json();
    if (result.success) {
     document.cookie="token="+result.token;
     localStorage.setItem("login",userData.email);
      window.dispatchEvent(new Event('localStorage-change'))
      navigate("/");
    } else{
      alert('Try after sometime');
    }
  }



  return (
    <div className="container">
      <h1>Login</h1>

      <label htmlFor="">Email</label>
      <input 
    onChange={(event)=>setUserData({...userData, email:event.target.value})} 
        type="text" name="email" placeholder="Enter Your Email" />      

      <label htmlFor="">Password</label>
      <input       
      onChange={(event)=>setUserData({...userData, password:event.target.value})} 

type="password" name="password" placeholder="Enter Your Password" />

      <button onClick={handleLogin} className="submit">Login</button>
      <Link className="link" to="/signup">SignUp</Link>
    </div>
  );
};

export default Login;