import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderForm({ userId }) {
  const [produtos, setProdutos] = useState([]);
  const [produtoSelecionado, setProdutoSelecionado] = useState('');
  const [quantidade, setQuantidade] = useState(1);

  // Carrega os produtos ao carregar o componente
  useEffect(() => {
    async function fetchProdutos() {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProdutos(response.data);
        if (response.data.length > 0) {
          setProdutoSelecionado(response.data[0].id); // Seleciona o primeiro produto por padrão
        }
      } catch (error) {
        console.error('Erro ao buscar produtos:', error);
      }
    }

    fetchProdutos();
  }, []);

  const fazerPedido = async () => {
    try {
      await axios.post('http://localhost:5000/pedidos', {
        usuario_id: userId,
        produtos: [
          {
            produto_id: produtoSelecionado,
            quantidade: Number(quantidade)
          }
        ]
      });
      alert('Pedido realizado com sucesso!');
    } catch (error) {
      alert('Erro ao fazer pedido: ' + error.response?.data?.mensagem || error.message);
    }
  };

  return (
    <div>
      <h2>Fazer Pedido</h2>

      <label>Produto:</label>
      <select value={produtoSelecionado} onChange={e => setProdutoSelecionado(Number(e.target.value))}>
        {produtos.map(produto => (
          <option key={produto.id} value={produto.id}>
            {produto.name}
          </option>
        ))}
      </select>

      <label>Quantidade:</label>
      <input
        type="number"
        value={quantidade}
        onChange={e => setQuantidade(e.target.value)}
        min="1"
      />

      <button onClick={fazerPedido}>Fazer Pedido</button>
    </div>
  );
}

export default OrderForm;
