import React from "react";
import { Card } from "react-bootstrap";

interface EstadoPedidoProps {
    estado: string;
}

const EstadoPedido: React.FC<EstadoPedidoProps> = ({ estado }) => {
    const getBackgroundColor = () => {
        switch (estado) {
            case "Entregado":
            case "Listo":
            case "Pagado":
                return "green";
            case "A confirmar":
                return "red";
            case "En cocina":
                return "yellow";
            case "En delivery":
                return "yellow";
            default:
                return "white";
        }
    };

    return (
        <Card.Text
            className="border border-dark p-2"
            style={{
                backgroundColor: getBackgroundColor(),
                color: "black",
                fontWeight: "bold"
            }}
        >
            {estado}
        </Card.Text>
    );
};

export default EstadoPedido;
