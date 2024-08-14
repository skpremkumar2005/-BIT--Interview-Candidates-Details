// Login.js
import React from 'react';

function Login({ name, setName, pwd, setPwd, submit }) {
  return (
    <div>
      <input
        type="text"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Username or Email"
      />
      <input
        type="password"
        value={pwd}
        onChange={(event) => setPwd(event.target.value)}
        placeholder="Password"
      />
      <button onClick={submit}>Submit</button>
    </div>
  );
}

export default Login;
