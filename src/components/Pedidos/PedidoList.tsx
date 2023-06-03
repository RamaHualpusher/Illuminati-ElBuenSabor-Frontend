import React from "react";
import { Pedido } from "../../interface/Pedido";
import PedidoCard from "./PedidoCard";

interface PedidoListProps {
    pedidos: Pedido[];
    cambiarEstadoPedido: (nuevoEstado: string) => void;
}

const PedidoList: React.FC<PedidoListProps> = ({ pedidos, cambiarEstadoPedido }) => {
    return (
        <div className="card-container container-sm">
            {pedidos.map((pedido) => (
                <PedidoCard key={pedido.idPedido} pedido={pedido} cambiarEstadoPedido={cambiarEstadoPedido} />
            ))}
        </div>
    );
};

export default PedidoList;
