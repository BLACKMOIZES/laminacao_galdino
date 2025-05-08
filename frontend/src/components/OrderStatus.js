import React, { useEffect, useState } from 'react';
import axios from 'axios';

function OrderStatus({ userId }) {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/pedidos/${userId}`)
      .then(res => setPedidos(res.data))
      .catch(err => console.error('Erro ao buscar pedidos:', err));
  }, [userId]);

  return (
    <div>
      <h2>Acompanhamento de Pedidos</h2>
      {pedidos.map(pedido => (
        <div key={pedido.id} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
          <p><strong>Status:</strong> {pedido.status}</p>
          <p><strong>Data:</strong> {new Date(pedido.data_pedido).toLocaleDateString()}</p>
          <p><strong>Produtos:</strong></p>
          <ul>
            {pedido.produtos.map((item, index) => (
              <li key={index}>
                {item.produto} - Quantidade: {item.quantidade}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default OrderStatus;
