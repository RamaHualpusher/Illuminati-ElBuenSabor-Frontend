import React from "react";
import { Card } from "react-bootstrap";

interface EstadoPedidoProps {
    estado: string;
}

const EstadoPedidoCard: React.FC<EstadoPedidoProps> = ({ estado }) => {
    // Función para obtener el color de fondo basado en el estado del pedido
    const getBackgroundColor = () => {
        switch (estado) {
            case "Entregado":
            case "Listo":
            case "Pagado":
                return "#03CA48"; // Verde
            case "A confirmar":
                return "#E07700"; // Naranja
            case "En cocina":
            case "En delivery":
                return "yellow"; // Amarillo
            case "Cancelado":
                return "#FF3131"; // Rojo
            default:
                return "white"; // Blanco por defecto
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
