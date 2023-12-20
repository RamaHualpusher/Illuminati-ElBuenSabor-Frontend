import React from "react";
import { IPedido } from "../../interface/IPedido";
import PedidoCardAdmin from "./PedidoCardAdmin";

interface PedidoListProps {
    pedidos: IPedido[];
    cambiarEstadoPedido: (nuevoEstado: string) => void;
}

const PedidoList: React.FC<PedidoListProps> = ({ pedidos, cambiarEstadoPedido }) => {
    return (
        <div className="card-container container-sm">
            {pedidos.map((pedido) => (
                // Renderiza un componente PedidoCardAdmin para cada pedido en la lista
                <PedidoCardAdmin key={pedido.id} pedido={pedido} cambiarEstadoPedido={cambiarEstadoPedido} />
            ))}
        </div>
    );
};

export default PedidoList;
