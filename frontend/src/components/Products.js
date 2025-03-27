import React, { useState, useEffect } from 'react';

const Products = () => {
    const [activeTab, setActiveTab] = useState('pecas');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [productName, setProductName] = useState('');
    const [productType, setProductType] = useState('');
    const [products, setProducts] = useState({ pecas: [], kits: [] });

    // 🔽 Carregar produtos do banco de dados ao carregar a página
    useEffect(() => {
        fetch('http://127.0.0.1:5000/api/products')  // URL corrigida
            .then(response => response.json())
            .then(data => {
                // 🔹 Filtra produtos conforme o tipo
                const pecas = data.filter(p => p.type === 'pecas').map(p => p.name);
                const kits = data.filter(p => p.type === 'kits').map(p => p.name);

                setProducts({ pecas, kits });
            })
            .catch(error => console.error('Erro ao buscar produtos:', error));
    }, []);

    // 🔽 Verifica a senha do administrador
    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (adminPassword === '12345') {
            setIsAuthenticated(true);
            alert('Autenticação bem-sucedida!');
            setAdminPassword('');
        } else {
            alert('Senha incorreta.');
            setAdminPassword('');
        }
    };

    // 🔽 Adiciona produto no frontend e backend
    const handleAddProduct = async (e) => {
        e.preventDefault();

        if (!isAuthenticated) {
            alert('Você precisa autenticar-se como administrador.');
            return;
        }
        if (!productType || !productName.trim()) {
            alert('Preencha todos os campos.');
            return;
        }

        const newProduct = { name: productName, description: productType };

        try {
            const response = await fetch('http://127.0.0.1:5000/api/products', { // URL corrigida
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct),
            });

            if (response.ok) {
                setProducts(prevState => ({
                    ...prevState,
                    [productType]: [...prevState[productType], productName]
                }));
                setProductName('');
                setProductType('');
                alert('Produto adicionado com sucesso!');
            } else {
                alert('Erro ao adicionar produto.');
            }
        } catch (error) {
            console.error('Erro ao conectar com o backend:', error);
        }
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'pecas':
                return (
                    <div>
                        <h2>Peças</h2>
                        <p>Pedido mínimo para peças: 100 unidades</p>
                        <ul>
                            {products.pecas.map((peca, index) => (
                                <li key={index}>{peca}</li>
                            ))}
                        </ul>
                    </div>
                );
            case 'kits':
                return (
                    <div>
                        <h2>Kits</h2>
                        <p>Pedido mínimo para kits: 25 unidades</p>
                        <ul>
                            {products.kits.map((kit, index) => (
                                <li key={index}>{kit}</li>
                            ))}
                        </ul>
                    </div>
                );
            case 'cadastrar':
                return (
                    <div>
                        <h2>Cadastrar Produto</h2>
                        {!isAuthenticated ? (
                            <>
                                <p>Digite a senha de administrador para liberar o cadastro.</p>
                                <form onSubmit={handlePasswordSubmit}>
                                    <input 
                                        type="password" 
                                        value={adminPassword} 
                                        onChange={(e) => setAdminPassword(e.target.value)} 
                                        placeholder="Senha" 
                                        required 
                                    />
                                    <button type="submit">Autenticar</button>
                                </form>
                            </>
                        ) : (
                            <>
                                <p>Autenticação confirmada. Agora você pode adicionar produtos.</p>
                                <form onSubmit={handleAddProduct}>
                                    <input 
                                        type="text" 
                                        value={productName} 
                                        onChange={(e) => setProductName(e.target.value)} 
                                        placeholder="Nome do Produto" 
                                        required 
                                    />
                                    <div>
                                        <label>
                                            <input 
                                                type="radio" 
                                                name="productType" 
                                                value="pecas" 
                                                checked={productType === 'pecas'} 
                                                onChange={() => setProductType('pecas')} 
                                            />
                                            Peça
                                        </label>
                                        <label>
                                            <input 
                                                type="radio" 
                                                name="productType" 
                                                value="kits" 
                                                checked={productType === 'kits'} 
                                                onChange={() => setProductType('kits')} 
                                            />
                                            Kit
                                        </label>
                                    </div>
                                    <button type="submit">Adicionar</button>
                                </form>
                            </>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div>
            <h2>Produtos</h2>
            <nav>
                <button onClick={() => setActiveTab('pecas')}>Peças</button>
                <button onClick={() => setActiveTab('kits')}>Kits</button>
                <button onClick={() => setActiveTab('cadastrar')}>Adicionar Produto</button>
            </nav>
            <div className="product-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default Products;
