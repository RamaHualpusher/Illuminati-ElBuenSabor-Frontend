import React, { useEffect, useState } from "react";
import { Card, Form, Row, Col } from "react-bootstrap";
import { Pedido } from "../../interface/Pedido";

const CajeroPage = () => {
    const [pedidos, setPedidos] = useState<Pedido[]>([]);
    const [filtroEstado, setFiltroEstado] = useState<string>("");

    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                const response = await fetch("assets/data/pedidos.json");
                const data = await response.json();
                setPedidos(data);
            } catch (error) {
                console.log(error);
            }
        };

        fetchPedidos();
    }, []);

    const handleEstadoFiltroChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setFiltroEstado(event.target.value);
    };

    const filteredPedidos = pedidos.filter(pedido => {
        if (filtroEstado === "") {
            return true;
        } else {
            return pedido.EstadoPedido.descripcion === filtroEstado;
        }
    });

    return (
        <div>
            <h1>Pedidos Pendientes</h1>
            <Form.Select value={filtroEstado} onChange={handleEstadoFiltroChange}>
                <option value="">Todos los estados</option>
                {/* Agrega las opciones de estado aquí */}
            </Form.Select>
            <div className="card-container">
                {filteredPedidos.map(pedido => (
                    <Card key={pedido.idPedido} className="pedido-card">
                        <Card.Body>
                            <Row>
                                <Col sm={6}>
                                    <Card.Text>Número de Pedido: {pedido.numeroPedido}</Card.Text>
                                    <Card.Text>Hora Estimada de Fin: {pedido.horaEstimadaFin ? new Date(pedido.horaEstimadaFin).toLocaleTimeString() : ""}</Card.Text>
                                    <Card.Text>Fecha del Pedido: {new Date(pedido.fechaPedido).toLocaleDateString()}</Card.Text>
                                </Col>
                                <Col sm={6}>
                                    <Card.Text className="text-end">Estado: {pedido.EstadoPedido.descripcion}</Card.Text>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default CajeroPage;
