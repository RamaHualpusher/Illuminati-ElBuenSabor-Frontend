import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import EstadoPedido from "./EstadoPedido";
import { Pedido } from "../../interface/Pedido";
import { Link } from "react-router-dom";

interface PedidoCardProps {
    pedido: Pedido;
    cambiarEstadoPedido: (nuevoEstado: string) => void;
}

const PedidoCard: React.FC<PedidoCardProps> = ({ pedido, cambiarEstadoPedido }) => {
    return (
        <Card className="pedido-card mb-2">
            <Card.Body>
                <Row>
                    <Col sm={4}>
                        <Card.Text>Pedido Número: {pedido.numeroPedido}</Card.Text>
                        <Card.Text>
                            <i className="bi bi-clock"></i>
                            {pedido.horaEstimadaFin ? new Date(pedido.horaEstimadaFin).toLocaleTimeString() : ""} - {pedido.TipoEntregaPedido.descripcion}
                        </Card.Text>
                        <Card.Text>{new Date(pedido.fechaPedido).toLocaleDateString()}</Card.Text>
                    </Col>
                    <Col sm={8}>
                        <div className="d-flex align-items-center justify-content-end">
                            <EstadoPedido estado={pedido.EstadoPedido.descripcion} />
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                            {pedido.EstadoPedido.descripcion === "A confirmar" && (
                                <>
                                    <button className="btn btn-primary me-2" onClick={() => cambiarEstadoPedido("A cocina")} disabled={pedido.TipoEntregaPedido.descripcion === "Retiro en local"}>
                                        A cocina
                                    </button>
                                    <button className="btn btn-primary" onClick={() => cambiarEstadoPedido("Listo")}>
                                        Listo
                                    </button>
                                </>
                            )}
                            {pedido.EstadoPedido.descripcion === "Listo" && (
                                <>
                                    <button
                                        className="btn btn-primary me-2"
                                        onClick={() => cambiarEstadoPedido("En delivery")}
                                        disabled={pedido.TipoEntregaPedido.descripcion !== "Envío a domicilio" || pedido.TipoPago.descripcion !== "Pago realizado"}
                                    >
                                        En delivery
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => cambiarEstadoPedido("Entregado")}
                                        disabled={pedido.TipoEntregaPedido.descripcion !== "Retiro en local" || pedido.TipoPago.descripcion !== "Pago realizado"}
                                    >
                                        Entregado
                                    </button>
                                </>
                            )}
                            {pedido.EstadoPedido.descripcion === "En delivery" && (
                                <>
                                    <Link to={`/pedido/${pedido.idPedido}`} className="btn btn-primary me-2">
                                        Ver detalles
                                    </Link>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => cambiarEstadoPedido("Entregado")}
                                        disabled={pedido.TipoEntregaPedido.descripcion !== "Retiro en local" || pedido.TipoPago.descripcion !== "Pago realizado"}
                                    >
                                        Entregado
                                    </button>
                                </>
                            )}
                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default PedidoCard;
