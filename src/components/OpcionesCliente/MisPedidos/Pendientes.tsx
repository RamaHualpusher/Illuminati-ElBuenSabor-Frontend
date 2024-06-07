import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IPedidoDto } from '../../../interface/IPedido';
import PedidoCardUsuario from './PedidoCardUsuario';
import { Link } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { IUsuario } from '../../../interface/IUsuario';
import NoHayPedidos from '../../Page404/NoHayPedidos';
import { useUser } from '../../../context/User/UserContext';

const Pendientes: React.FC = () => {
    const [pedidosPendientes, setPedidosPendientes] = useState<IPedidoDto[]>([]);
    const { user, isAuthenticated } = useAuth0();
    const API_URL = process.env.REACT_APP_API_URL || "";
    const { usuarioContext } = useUser();

    useEffect(() => {
        const fetchPedidosPendientes = async () => {
            try {
                
                // Verificar el usuario existente
                const response = await axios.get(`${API_URL}usuario`);
                const usuarioDB = response.data;
                const usuarioEncontrado = usuarioDB.find((usuario: IUsuario) => usuario.email === user?.email || usuarioContext?.email );
                if (usuarioEncontrado) {
                    // Obtener los pedidos del usuario
                    const pedidosResponse = await axios.get<IPedidoDto[]>(`${API_URL}pedido/usuario/${usuarioEncontrado.id}`);
                    // Filtrar los pedidos pendientes
                    const pedidosPendientes = pedidosResponse.data.filter((pedido) =>
                        // ['A confirmar', 'En cocina', 'Listo', 'En delivery'].includes(pedido.estadoPedido)
                    ['A confirmar', 'En cocina'].includes(pedido.estadoPedido)

                    );
                    pedidosPendientes.sort((a, b) => new Date(b.fechaPedido).getTime() - new Date(a.fechaPedido).getTime());
                    setPedidosPendientes(pedidosPendientes);
                } else {
                    console.error("No se encontró el usuario en la base de datos.");
                }
            } catch (error) {
                console.error("Error al verificar el usuario existente:", error);
                // Manejar el error aquí según sea necesario, como mostrar un mensaje de error al usuario
            }
        };

        fetchPedidosPendientes();
    }, [isAuthenticated, user]);   

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
                    <div className="text-center">
                        <Link to="/" className="btn btn-primary btn-lg">
                            Ver Catálogo
                        </Link>
                    </div>
                    <NoHayPedidos onReload={() => window.location.reload()} />
                </>
            )}
        </div>
    );
};

export default Pendientes;
