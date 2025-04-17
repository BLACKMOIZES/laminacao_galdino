import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import RegisterUser from './components/RegisterUser';
import Products from './components/Products';
import AboutUs from './components/AboutUs';
import './App.css';

// ✅ Importando a logo direto da pasta src/assets
import logoImage from './assets/LogoLG.jpeg';

function App() {
    const location = useLocation();

    return (
        <div>
            {location.pathname === '/about' && (
                <video autoPlay loop muted className="video-background">
                    <source src="/video.mp4" type="video/mp4" />
                    Seu navegador não suporta vídeos.
                </video>
            )}

            {/* ✅ Exibindo a logo como imagem */}
            <header className="App-header">
                <img src={logoImage} alt="Logo Galdino" className="App-logo-img" />
                <h1>LAMINAÇÃO GALDINO</h1>
            </header>

            <nav>
                <Link to="/">Cadastro</Link>
                <Link to="/products">Produtos</Link>
                <Link to="/about">Quem Somos Nós</Link>
            </nav>

            <div className="container">
                <Routes>
                    <Route path="/" element={<RegisterUser />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/about" element={<AboutUs />} />
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
