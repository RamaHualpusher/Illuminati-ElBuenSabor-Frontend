import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pedido } from '../../../interface/Pedido';
import PedidoCardUsuario from './PedidoCardUsuario';
import { Link } from 'react-router-dom';

const Pendientes: React.FC = () => {
    const [pedidosPendientes, setPedidosPendientes] = useState<Pedido[]>([]);

    useEffect(() => {
        const fetchPedidosPendientes = async () => {
            try {
                const response = await axios.get<Pedido[]>('/assets/data/pedidos.json');
                const pedidos = response.data.filter((pedido) =>
                    pedido.estadoPedido === 'A confirmar' ||
                    pedido.estadoPedido === 'En cocina' ||
                    pedido.estadoPedido === 'Listo' ||
                    pedido.estadoPedido === 'En delivery'
                );
                setPedidosPendientes(pedidos);
            } catch (error) {
                console.log(error);
            }
        };

        fetchPedidosPendientes();
    }, []);

    return (
        <div style={{ minHeight: 'calc(100vh - 90px)' }}>
            {pedidosPendientes.length > 0 ? (
                pedidosPendientes.map((pedido) => (
                    <PedidoCardUsuario
                        key={pedido.idPedido}
                        pedido={pedido}
                    />
                ))
            ) : (
                <>
                    <p>No hay pedidos pendientes disponibles.</p>
                    <div className="text-center">
                        <Link to="/" className="btn btn-primary btn-lg mb-3">
                            Ver Catálogo
                        </Link>
                    </div>
                </>
            )}
        </div>
    );
};

export default Pendientes;
