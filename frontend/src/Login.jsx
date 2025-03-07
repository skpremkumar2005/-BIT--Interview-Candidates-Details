import { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'
const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleLogin = () => {
    // Here you can decide which value you want to send (name or email)
   
    try{
      axios.post('http://localhost:3000/',{name,email,password}).then((res)=>{
   
        
        login(res.data.role);
        if(res.data.role==='user'||res.data.role==='admin')
        { 
          navigate(res.data.role == 'admin' ? '/admin' : '/user');

        }
        else  alert('Invalid crediancial');
      })      
    }
    catch(err){
      console.log(err)
      alert('Invalid crediancial');
    }
   // Redirect based on role
  };

  return (
    <div className='login-container'>
      <h2>Login</h2>
      <div>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;
