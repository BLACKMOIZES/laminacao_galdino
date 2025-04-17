import React, { useState } from 'react';
import axios from 'axios';

const RegisterUser  = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:5000/api/users', { name, email });
            setMessage('Usuário cadastrado com sucesso!');
            setName('');
            setEmail('');
        } catch (error) {
            console.error('Erro ao cadastrar usuário:', error);
            setMessage('Erro ao cadastrar usuário.');
        }
    };

    return (
        <div>
            <h2>Cadastre-se</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Cadastrar</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RegisterUser ;