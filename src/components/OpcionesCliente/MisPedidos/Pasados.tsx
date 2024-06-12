import React, { useEffect, useState } from "react";
import axios from "axios";
import { IPedidoDto } from "../../../interface/IPedido";
import PedidoCardUsuario from "./PedidoCardUsuario";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { IUsuario } from "../../../interface/IUsuario";
import NoHayPedidos from "../../Page404/NoHayPedidos";
import { useUser } from "../../../context/User/UserContext";

const Pasados: React.FC = () => {
  // Estado para almacenar los pedidos pasados
  const [pedidosPasados, setPedidosPasados] = useState<IPedidoDto[]>([]);
  const { isAuthenticated, user } = useAuth0();
  const API_URL = process.env.REACT_APP_API_URL || "";
  const { usuarioContext } = useUser();

  // Obtener y filtrar los pedidos pasados al montar el componente
  useEffect(() => {
    const fetchPedidosPasados = async () => {
      try {
        
        // Verificar el usuario existente
        const responseUsuario = await axios.get(`${API_URL}usuario`);
        console.log(responseUsuario);
        const usuarioDB: IUsuario[] = responseUsuario.data;
        const usuarioEncontrado = usuarioDB.find(
          (usuario: IUsuario) => usuario.email === user?.email || usuario.email === usuarioContext?.email
        );

        if (usuarioEncontrado) {
          const responsePedidos = await axios.get<IPedidoDto[]>(
            `${API_URL}pedido/usuario/${usuarioEncontrado.id}`
          );
          console.log(responsePedidos.data)
          const pedidosResponse: IPedidoDto[] = responsePedidos.data;

          // Filtrar pedidos entregados y cancelados
          const entregados = pedidosResponse.filter(
            (pedido) => pedido.estadoPedido === "Entregado"
          );
          const cancelados = pedidosResponse.filter(
            (pedido) => pedido.estadoPedido === "Cancelado"
          );

          // Concatenar los pedidos entregados y cancelados
          const pedidos = [...entregados, ...cancelados];

          pedidos.sort(
            (a, b) =>
              new Date(b.horaEstimadaFin).getTime() -
              new Date(a.horaEstimadaFin).getTime()
          );
          setPedidosPasados(pedidos);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPedidosPasados();
  }, [isAuthenticated, user, usuarioContext]);

  return (
    <div style={{ minHeight: "calc(100vh - 90px)" }}>
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

export default Pasados;
