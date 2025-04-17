import React, { useState, useEffect } from 'react';

const Products = () => {
    const [activeTab, setActiveTab] = useState('pecas');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminPassword, setAdminPassword] = useState('');
    const [productName, setProductName] = useState('');
    const [productType, setProductType] = useState('pecas');
    const [products, setProducts] = useState({ pecas: [], kits: [] });
    const [editingProduct, setEditingProduct] = useState(null); // Novo estado para edição

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('http://127.0.0.1:5000/api/products');
            const data = await res.json();
            const pecas = data.filter(p => p.description === 'pecas');
            const kits = data.filter(p => p.description === 'kits');
            setProducts({ pecas, kits });
        } catch (error) {
            console.error('Erro ao buscar produtos:', error);
        }
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (adminPassword === '12345') {
            setIsAuthenticated(true);
            alert('Autenticação bem-sucedida!');
        } else {
            alert('Senha incorreta.');
        }
        setAdminPassword('');
    };

    const handleAddOrUpdateProduct = async (e) => {
        e.preventDefault();

        if (!productName.trim()) return alert('Preencha o nome do produto.');

        const payload = {
            name: productName,
            description: productType
        };

        if (editingProduct) {
            // Atualizar
            try {
                const res = await fetch(`http://127.0.0.1:5000/api/products/${editingProduct.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    alert('Produto atualizado!');
                    setEditingProduct(null);
                    setProductName('');
                    setProductType('pecas');
                    fetchProducts();
                }
            } catch (err) {
                console.error('Erro ao atualizar produto:', err);
            }
        } else {
            // Adicionar
            try {
                const res = await fetch('http://127.0.0.1:5000/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    alert('Produto adicionado!');
                    setProductName('');
                    setProductType('pecas');
                    fetchProducts();
                }
            } catch (err) {
                console.error('Erro ao adicionar produto:', err);
            }
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir este produto?')) return;
        try {
            const res = await fetch(`http://127.0.0.1:5000/api/products/${id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                alert('Produto deletado!');
                fetchProducts();
            }
        } catch (err) {
            console.error('Erro ao deletar produto:', err);
        }
    };

    const startEdit = (product) => {
        setEditingProduct(product);
        setProductName(product.name);
        setProductType(product.description);
        setActiveTab('cadastrar');
    };

    const renderProductList = (list, type) => (
        <ul>
            {list.map(prod => (
                <li key={prod.id}>
                    {prod.name}
                    {isAuthenticated && (
                        <>
                            {' '}
                            <button onClick={() => startEdit(prod)}>Editar</button>
                            <button onClick={() => handleDelete(prod.id)}>Excluir</button>
                        </>
                    )}
                </li>
            ))}
        </ul>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'pecas':
                return (
                    <div>
                        <h2>Peças</h2>
                        <p>Pedido mínimo para peças: 100 unidades</p>
                        {renderProductList(products.pecas, 'pecas')}
                    </div>
                );
            case 'kits':
                return (
                    <div>
                        <h2>Kits</h2>
                        <p>Pedido mínimo para kits: 25 unidades</p>
                        {renderProductList(products.kits, 'kits')}
                    </div>
                );
            case 'cadastrar':
                return (
                    <div>
                        <h2>{editingProduct ? 'Editar Produto' : 'Cadastrar Produto'}</h2>
                        {!isAuthenticated ? (
                            <form onSubmit={handlePasswordSubmit}>
                                <input
                                    type="password"
                                    value={adminPassword}
                                    onChange={(e) => setAdminPassword(e.target.value)}
                                    placeholder="Senha de administrador"
                                    required
                                />
                                <button type="submit">Autenticar</button>
                            </form>
                        ) : (
                            <form onSubmit={handleAddOrUpdateProduct}>
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
                                            name="tipoProduto"
                                            value="pecas"
                                            checked={productType === 'pecas'}
                                            onChange={() => setProductType('pecas')}
                                        />
                                        Peças
                                    </label>
                                    <label>
                                        <input
                                            type="radio"
                                            name="tipoProduto"
                                            value="kits"
                                            checked={productType === 'kits'}
                                            onChange={() => setProductType('kits')}
                                        />
                                        Kits
                                    </label>
                                </div>
                                <button type="submit">{editingProduct ? 'Salvar Alterações' : 'Adicionar Produto'}</button>
                                {editingProduct && (
                                    <button type="button" onClick={() => {
                                        setEditingProduct(null);
                                        setProductName('');
                                        setProductType('pecas');
                                    }}>Cancelar Edição</button>
                                )}
                            </form>
                        )}
                    </div>
                );
            default:
                return <p>Selecione uma aba válida.</p>;
        }
    };

    return (
        <div>
            <nav>
                <button onClick={() => setActiveTab('pecas')}>Peças</button>
                <button onClick={() => setActiveTab('kits')}>Kits</button>
                <button onClick={() => setActiveTab('cadastrar')}>Cadastrar Produto</button>
            </nav>
            <hr />
            {renderContent()}
        </div>
    );
};

export default Products;
