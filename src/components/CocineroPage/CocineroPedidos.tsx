import React, { useState, useEffect } from 'react';
import { Pedido } from '../../interface/Pedido';
import PedidoList from '../Pedidos/PedidoList';

/**
 * Componente para que el cocinero administre los pedidos en cocina y cambie su estado a "Listo".
 */
const CocineroPedido: React.FC = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

    // Cargar los pedidos desde una fuente de datos al cargar el componente
    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await fetch("assets/data/pedidos.json");
                const data = await response.json();
                setPedidos(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchPedidos();
    }, []);

    // Cambiar el estado de un pedido a "Listo" si está en estado "En cocina"
    const cambiarEstadoPedido = (nuevoEstado: string) => {
        if (pedidoSeleccionado) {
            const { estadoPedido, esDelivery, esEfectivo } = pedidoSeleccionado;

            if (estadoPedido === "En cocina" && nuevoEstado === "Listo") {
                // Aquí debes modificar el estado del pedido a "Listo"
                setPedidoSeleccionado({ ...pedidoSeleccionado, estadoPedido: nuevoEstado });
            }
        }
    };

    // Filtrar los pedidos en cocina
    const pedidosEnCocina = pedidos.filter((pedido) => pedido.estadoPedido === "En cocina");

    return (
        <div className="container mt-3">
            {/* Mostrar la lista de pedidos en cocina */}
            <PedidoList pedidos={pedidosEnCocina} cambiarEstadoPedido={cambiarEstadoPedido} />
        </div>
    );
};

export default CocineroPedido;
