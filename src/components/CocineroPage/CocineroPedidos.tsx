import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PedidoList from '../Pedidos/PedidoList';
import NoHayPedidos from '../Page404/NoHayPedidos';
import { IPedido } from '../../interface/IPedido';

const CocineroPedido: React.FC = () => {
  const [pedidos, setPedidos] = useState<IPedido[]>([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<IPedido | null>(null);
  const API_URL = process.env.REACT_APP_API_URL || '';

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const response = await axios.get(`${API_URL}pedido/estado/En_cocina`);
        setPedidos(response.data);
      } catch (error) {
        console.log('Error fetching pedidos:', error);
      }
    };

    fetchPedidos();
  }, []);

  const handleConfirmacion = async () => {
    try {
      const response = await axios.get(`${API_URL}pedido/${pedidoSeleccionado?.id}`);
      const pedidoCompleto = response.data;
      pedidoCompleto.estadoPedido = 'Listo';
      const updateResponse = await axios.put(`${API_URL}pedido/${pedidoSeleccionado?.id}`, pedidoCompleto);
      setPedidoSeleccionado(pedidoCompleto);
      alert('El estado del pedido se ha cambiado a "Listo".');
    } catch (error) {
      console.log('Error updating pedido:', error);
    }
  };

  const cambiarEstadoPedido = (nuevoEstado: string) => {
    if (pedidoSeleccionado && pedidoSeleccionado.estadoPedido === 'En cocina' && nuevoEstado === 'Listo') {
      const confirmacion = window.confirm('¿Está seguro de que desea cambiar el estado del pedido a "Listo"?');
      if (confirmacion) {
        handleConfirmacion();
      }
    }
  };

  return (
    <div className="container mt-3">
      {pedidos.length > 0 ? (
        <PedidoList pedidos={pedidos} cambiarEstadoPedido={cambiarEstadoPedido} />
      ) : (
        <NoHayPedidos onReload={() => window.location.reload()} />
      )}
    </div>
  );
};

export default CocineroPedido;
