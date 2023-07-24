import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Pedido } from '../../../interface/Pedido';
import PedidoCardUsuario from './PedidoCardUsuario';
import { Link } from 'react-router-dom';

const Pasados: React.FC = () => {
    const [pedidosPasados, setPedidosPasados] = useState<Pedido[]>([]);
    const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

    useEffect(() => {
        const fetchPedidosPasados = async () => {
            try {
                const response = await axios.get<Pedido[]>('/assets/data/pedidos.json');
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
        <>
            <div style={{ minHeight: 'calc(100vh - 90px)' }}>
                {pedidosPasados.length > 0 ? (
                    pedidosPasados.map((pedido) => (
                        <div key={pedido.idPedido}>
                            <PedidoCardUsuario pedido={pedido} />
                        </div>
                    ))
                ) : (
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
        </>
    );
};

export default Pasados;
