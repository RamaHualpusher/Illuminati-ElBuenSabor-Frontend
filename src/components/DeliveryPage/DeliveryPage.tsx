import React, { useEffect, useState } from "react";
import { Pedido } from "../../interface/Pedido";
import PedidoList from "../Pedidos/PedidoList";

const DeliveryPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

  useEffect(() => {
    // Cargar la lista de pedidos al montar el componente
    const fetchPedidos = async () => {
      try {
        const response = await fetch("assets/data/pedidos.json");
        const data = await response.json();
        setPedidos(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchPedidos();
  }, []);

  const cambiarEstadoPedido = (nuevoEstado: string) => {
    if (pedidoSeleccionado) {
      const { estadoPedido, esDelivery, esEfectivo } = pedidoSeleccionado;

      // Verificar las condiciones para cambiar el estado del pedido
      if (
        (estadoPedido === "Listo" && nuevoEstado === "En delivery" && esDelivery) ||
        (estadoPedido === "Listo" && nuevoEstado === "Entregado" && esDelivery && esEfectivo)
      ) {
        setPedidoSeleccionado({ ...pedidoSeleccionado, estadoPedido: nuevoEstado });
      }
    }
  };

  // Filtrar los pedidos en estado "En delivery"
  const pedidosEnDelivery = pedidos.filter((pedido) => pedido.estadoPedido === "En delivery");

  return (
    <div className="container mt-3">
      {/* Renderizar la lista de pedidos en delivery */}
      <PedidoList pedidos={pedidosEnDelivery} cambiarEstadoPedido={cambiarEstadoPedido} />
    </div>
  );
};

export default DeliveryPage;
