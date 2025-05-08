import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import RegisterUser from './components/RegisterUser';
import Products from './components/Products';
import AboutUs from './components/AboutUs';
import OrderForm from './components/OrderForm';
import OrderStatus from './components/OrderStatus';
import Login from './components/Login';
import './App.css';
import logoImage from './assets/LogoLG.jpeg';

function App() {
    const location = useLocation();
    const [user, setUser] = useState(null); // Estado para usuário logado

    return (
        <div>
            {location.pathname === '/about' && (
                <video autoPlay loop muted className="video-background">
                    <source src="/video.mp4" type="video/mp4" />
                    Seu navegador não suporta vídeos.
                </video>
            )}

            <header className="App-header">
                <img src={logoImage} alt="Logo Galdino" className="App-logo-img" />
                <h1>LAMINAÇÃO GALDINO</h1>
            </header>

            <nav>
               <Link to="/">Cadastro</Link>
               <Link to="/products">Produtos</Link>
               <Link to="/about">Quem Somos Nós</Link>
               <Link to="/fazer-pedido">Fazer Pedido</Link>
               <Link to="/acompanhamento">Acompanhar Pedido</Link>
    
    {!user ? (
        <Link to="/login">Login</Link>
    ) : (
        <>
            <span style={{ marginLeft: '10px' }}>Bem-vindo, {user.name}</span>
            <button 
                onClick={() => setUser(null)} 
                style={{ marginLeft: '10px', background: 'red', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
            >
                Sair
            </button>
        </>
    )}
</nav>


            <div className="container">
                <Routes>
                    <Route path="/" element={<RegisterUser />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/login" element={<Login setUser={setUser} />} />
                    <Route path="/fazer-pedido" element={
                        user ? <OrderForm userId={user.id} /> : <p>Faça login para fazer um pedido.</p>
                    } />
                    <Route path="/acompanhamento" element={
                        user ? <OrderStatus userId={user.id} /> : <p>Faça login para acompanhar seus pedidos.</p>
                    } />
                </Routes>
            </div>

            <footer className="App-footer">
                <h2>LAMINAÇÃO GALDINO</h2>
            </footer>
        </div>
    );
}

export default function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}
