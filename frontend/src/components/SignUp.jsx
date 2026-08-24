import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/App.css";

const SignUp = () => {
  const [userData, setUserData] = useState();
  const navigate = useNavigate();

  useEffect(()=>{
    if(localStorage.getItem('login')){
      navigate("/");
    }
  },[]);


  const handleSignUp = async () => {
    let result = await fetch("http://localhost:3200/signup", {
      method: "Post",
      body: JSON.stringify(userData),
      headers: {
        "Content-Type": "Application/Json",
      },
    });
    result = await result.json();
    if (result.success) {
      document.cookie = "token=" + result.token;
      localStorage.setItem("login", userData.email);
      navigate("/login");
    } else {
      alert("Try after sometime");
    }
  };

  return (
    <div className="container">
      <h1>Sign Up</h1>

      <label htmlFor="">Name</label>
      <input
        onChange={(event) =>
          setUserData({ ...userData, name: event.target.value })
        }
        type="text"
        name="name"
        placeholder="Enter Your Name"
      />

      <label htmlFor="">Email</label>
      <input
        onChange={(event) =>
          setUserData({ ...userData, email: event.target.value })
        }
        type="text"
        name="email"
        placeholder="Enter Your Email"
      />

      <label htmlFor="">Password</label>
      <input
        onChange={(event) =>
          setUserData({ ...userData, password: event.target.value })
        }
        type="text"
        name="password"
        placeholder="Enter Your Password"
      />

      <button onClick={handleSignUp} className="submit">
        Sign Up
      </button>
      <Link className="link" to="/login">
        Login
      </Link>
    </div>
  );
};

export default SignUp;
