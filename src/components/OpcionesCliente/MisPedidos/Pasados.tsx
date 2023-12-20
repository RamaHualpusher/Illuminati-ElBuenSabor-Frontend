import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IPedido } from '../../../interface/IPedido';
import PedidoCardUsuario from './PedidoCardUsuario';
import { Link } from 'react-router-dom';

const Pasados: React.FC = () => {
    // Estado para almacenar los pedidos pasados
    const [pedidosPasados, setPedidosPasados] = useState<IPedido[]>([]);

    // Estado para almacenar el pedido seleccionado
    const [selectedPedido, setSelectedPedido] = useState<IPedido | null>(null);

    // Obtener y filtrar los pedidos pasados al montar el componente
    useEffect(() => {
        const fetchPedidosPasados = async () => {
            try {
                const response = await axios.get<IPedido[]>('/assets/data/pedidos.json');
                const pedidos = response.data.filter((pedido) =>
                    pedido.estadoPedido === 'Entregado' || pedido.estadoPedido === 'Cancelado'
                );
                setPedidosPasados(pedidos);
            } catch (error) {
                console.log(error);
            }
        };

        fetchPedidosPasados();
    }, []);

    return (
        <div style={{ minHeight: 'calc(100vh - 90px)' }}>
            {pedidosPasados.length > 0 ? (
                // Mostrar la lista de pedidos pasados si hay al menos uno
                pedidosPasados.map((pedido) => (
                    <div key={pedido.id}>
                        <PedidoCardUsuario pedido={pedido} />
                    </div>
                ))
            ) : (
                // Mostrar mensaje si no hay pedidos pasados disponibles
                <>
                    <p>No hay pedidos pasados disponibles.</p>
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

export default Pasados;
