import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { IPedido } from '../../../interface/IPedido';
import axios from 'axios';
import PedidoCardUsuario from '../../OpcionesCliente/MisPedidos/PedidoCardUsuario';
import AdminBar from '../../NavBar/AdminBar';

const PedidosID: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [pedidos, setPedidos] = useState<IPedido[]>([]);
    const API_URL = process.env.REACT_APP_API_URL || "";

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                if (id) {
                    const response = await axios.get(API_URL+'pedido/usuario/'+id);
                    const data = response.data;
                    const pedidosFiltrados = data.filter((pedido: IPedido) => pedido.Usuario.id === parseInt(id));
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
                {pedidos.map((pedido: IPedido) => (
                    <div key={pedido.id}>
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