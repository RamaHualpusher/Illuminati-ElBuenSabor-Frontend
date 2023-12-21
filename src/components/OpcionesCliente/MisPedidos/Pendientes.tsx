import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IPedido } from '../../../interface/IPedido';
import PedidoCardUsuario from './PedidoCardUsuario';
import { Link } from 'react-router-dom';

const Pendientes: React.FC = () => {
    const [pedidosPendientes, setPedidosPendientes] = useState<IPedido[]>([]);

    useEffect(() => {
        const fetchPedidosPendientes = async () => {
            try {
                const response = await axios.get<IPedido[]>('/assets/data/pedidos.json');
                // Filtrar los pedidos con estados pendientes
                const pedidos = response.data.filter((pedido) =>
                    ['A confirmar', 'En cocina', 'Listo', 'En delivery'].includes(pedido.estadoPedido)
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
                        key={pedido.id}
                        pedido={pedido}
                    />
                ))
            ) : (
                // Mostrar mensaje si no hay pedidos pendientes
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
