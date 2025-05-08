import React, { useState } from 'react';
import axios from 'axios';

function Login({ setUser }) {
  const [email, setEmail] = useState('');

  const handleLogin = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users');
      const user = res.data.find(u => u.email === email);
      if (user) {
        setUser(user);  // Salva usuário logado no estado principal
        alert('Login bem-sucedido!');
      } else {
        alert('Usuário não encontrado.');
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}

export default Login;
