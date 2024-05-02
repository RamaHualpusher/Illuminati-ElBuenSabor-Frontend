import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IPedidoDto } from '../../../interface/IPedido';
import PedidoCardUsuario from './PedidoCardUsuario';
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { IUsuario } from '../../../interface/IUsuario';
import NoHayPedidos from '../../Page404/NoHayPedidos';

const Pasados: React.FC = () => {
    // Estado para almacenar los pedidos pasados
    const [pedidosPasados, setPedidosPasados] = useState<IPedidoDto[]>([]);
    const { isAuthenticated, user } = useAuth0();
    const API_URL = process.env.REACT_APP_API_URL || "";

    // Obtener y filtrar los pedidos pasados al montar el componente
    useEffect(() => {
        const fetchPedidosPasados = async () => {
            try {
                if (!isAuthenticated || !user) return;

                // Verificar el usuario existente
                const responseUsuario = await axios.get(`${API_URL}usuario`);
                const usuarioDB: IUsuario[] = responseUsuario.data;
                const usuarioEncontrado = usuarioDB.find((usuario: IUsuario) => usuario.email === user.email);

                if (usuarioEncontrado) {
                    const responsePedidos = await axios.get<IPedidoDto[]>(`${API_URL}pedido/usuario/${usuarioEncontrado.id}`);
                    const pedidosResponse: IPedidoDto[] = responsePedidos.data;

                    // Filtrar pedidos entregados y cancelados
                    const entregados = pedidosResponse.filter((pedido) => pedido.estadoPedido === 'Entregado');
                    const cancelados = pedidosResponse.filter((pedido) => pedido.estadoPedido === 'Cancelado');

                    // Concatenar los pedidos entregados y cancelados
                    const pedidos = [...entregados, ...cancelados];

                    pedidos.sort((a, b) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime());
                    setPedidosPasados(pedidos);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchPedidosPasados();
    }, [isAuthenticated, user]);

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
                   <NoHayPedidos onReload={() => window.location.reload()} />
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
