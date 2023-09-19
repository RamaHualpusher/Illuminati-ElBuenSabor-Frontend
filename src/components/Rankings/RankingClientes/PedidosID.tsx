import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Pedido } from '../../../interface/Pedido';
import axios from 'axios';
import PedidoCardUsuario from '../../OpcionesCliente/MisPedidos/PedidoCardUsuario';
import AdminBar from '../../NavBar/AdminBar';

const PedidosID: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const API_URL = "/assets/data/pedidos.json";

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                if (id) {
                    const response = await axios.get(API_URL);
                    const data = response.data;
                    const pedidosFiltrados = data.filter((pedido: Pedido) => pedido.Usuario.idUsuario === parseInt(id));
                    setPedidos(pedidosFiltrados || []);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchPedidos();
    }, [id]);

    return (
        <div className="container mt-5">
            <AdminBar />
            <div className="row mt-5">
                <div className="col mt-4">
                    <h1 className='display-5'>Pedidos del Usuario</h1>
                </div>
            </div>
            <div className="row">
                {pedidos.map((pedido: Pedido) => (
                    <div key={pedido.idPedido}>
                        <div className="card-body">
                            <PedidoCardUsuario pedido={pedido} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default PedidosID;
