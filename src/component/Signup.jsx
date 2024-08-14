import React, { useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const navigate=useNavigate();
  const handle = (e) => {
    console.log(pwd);
    e.preventDefault(); // Prevent default form submission behavior
    Axios.post("http://localhost:3000/auth/signup", { username, email, pwd })
      .then(res => navigate("/signup/admin"))
      .catch(error => console.error(pwd)); // Log the error for troubleshooting
  };

  return (
    <div>
      <form onSubmit={handle}>
        <label>Username</label> <input type='text' value={username} onChange={(e) => setUsername(e.target.value)}></input>
        <label>Email</label> <input type='text' value={email} onChange={(e) => setEmail(e.target.value)}></input>
        <label>Password</label> <input type='password' value={pwd} onChange={(e) => setPwd(e.target.value)}></input>
        <button type='submit'>Submit</button>
      </form>
    </div>
  );
};

export default Signup;
