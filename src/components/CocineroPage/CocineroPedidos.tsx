import React, { useState, useEffect } from 'react';
import { Pedido } from '../../interface/Pedido';
import PedidoList from '../Pedidos/PedidoList';

const CocineroPedido: React.FC = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);

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

    const cambiarEstadoPedido = (nuevoEstado: string) => {
        if (pedidoSeleccionado) {
            const { estadoPedido, esDelivery, esEfectivo } = pedidoSeleccionado;

            if (estadoPedido === "En cocina" && nuevoEstado === "En delivery") {
                setPedidoSeleccionado({ ...pedidoSeleccionado, estadoPedido: nuevoEstado });
            }
        }
    };

    const pedidosEnDelivery = pedidos.filter((pedido) => pedido.estadoPedido === "En cocina");

    return (
        <div className="container mt-3">
            <PedidoList pedidos={pedidosEnDelivery} cambiarEstadoPedido={cambiarEstadoPedido} />
        </div>
    );
};

export default CocineroPedido;
