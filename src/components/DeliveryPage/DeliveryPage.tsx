import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PedidoList from '../Pedidos/PedidoList';
import NoHayPedidos from '../Page404/NoHayPedidos';
import { IPedidoDto } from '../../interface/IPedido';

const DeliveryPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<IPedidoDto[]>([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<IPedidoDto | null>(null);
  const [cargando, setCargando] = useState<boolean>(true);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL || '';
        const response = await axios.get(`${API_URL}pedido/estado/En_delivery`);
        setPedidos(response.data);
        setCargando(false);
      } catch (error) {
        console.error(error);
        setCargando(false);
      }
    };

    fetchPedidos();
  }, []);

  const handleConfirmacion = async () => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || '';
      const response = await axios.get(`${API_URL}pedido/${pedidoSeleccionado?.id}`);
      const pedidoCompleto = response.data;

      // Actualizar el estado del pedido a "Entregado"
      pedidoCompleto.estadoPedido = 'Entregado';

      // Enviar la solicitud PATCH o PUT a la API para actualizar el pedido
      const updateResponse = await axios.put(`${API_URL}pedido/${pedidoSeleccionado?.id}`, pedidoCompleto);

      // Actualizar el estado local con el pedido modificado
      setPedidoSeleccionado(pedidoCompleto);

      // Mostrar alerta de confirmación después de la actualización
      alert('El estado del pedido se ha cambiado a "Entregado".');
    } catch (error) {
      console.error('Error updating pedido:', error);
    }
  };

  const cambiarEstadoPedido = (nuevoEstado: string) => {
    if (pedidoSeleccionado && pedidoSeleccionado.estadoPedido === 'En delivery' && nuevoEstado === 'Entregado') {
      const confirmacion = window.confirm('¿Está seguro de que desea cambiar el estado del pedido a "Entregado"?');
      if (confirmacion) {
        handleConfirmacion();
      }
    }
  };

  return (
    <div className="container mt-3">
      {cargando ? (
        <div className="text-center">
          <h3>Cargando pedidos...</h3>
        </div>
      ) : (
        pedidos.length > 0 ? (
          <PedidoList pedidos={pedidos} cambiarEstadoPedido={cambiarEstadoPedido} />
        ) : (
          <NoHayPedidos onReload={() => window.location.reload()} />
        )
      )}
    </div>
  );
};

export default DeliveryPage;
