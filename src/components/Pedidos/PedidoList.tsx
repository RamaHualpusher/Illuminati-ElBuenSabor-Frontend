import React from "react";
import { Pedido } from "../../interface/Pedido";
import PedidoCard from "./PedidoCard";

interface PedidoListProps {
    pedidos: Pedido[];
    cambiarEstadoPedido: (nuevoEstado: string) => void;
    btnTicket:boolean;
    phat:string;
}

const PedidoList: React.FC<PedidoListProps> = ({ pedidos, cambiarEstadoPedido, btnTicket, phat }) => {
    return (
        <div className="card-container container-sm">
            {pedidos.map((pedido) => (
                <PedidoCard key={pedido.idPedido} pedido={pedido} cambiarEstadoPedido={cambiarEstadoPedido} btnTikect={btnTicket} phat={phat}/>
            ))}
        </div>
    );
};

export default PedidoList;
