import React from "react";
import { Card } from "react-bootstrap";

interface EstadoPedidoProps {
    estado: string;
}

const EstadoPedidoCard: React.FC<EstadoPedidoProps> = ({ estado }) => {
    const getBackgroundColor = () => {
        switch (estado) {
            case "Entregado":
            case "Listo":
            case "Pagado":
                return "#03CA48";
            case "A confirmar":
                return "#E07700";
            case "En cocina":
            case "En delivery":
                return "yellow";
            case "Cancelado":
                return "#FF3131"; 
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

export default EstadoPedidoCard;
