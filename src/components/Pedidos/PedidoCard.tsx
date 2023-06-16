import React ,{useState}from "react";
import { Card, Row, Col } from "react-bootstrap";
import EstadoPedidoCard from "./EstadoPedidoCard";
import { Pedido } from "../../interface/Pedido";
import { Link } from "react-router-dom";
import { EstadoPedido } from "../../interface/EstadoPedido";

interface PedidoCardProps {
    pedido: Pedido;
    cambiarEstadoPedido: (nuevoEstado: string) => void;
    btnTikect: boolean;
    phat: string;
}

const PedidoCard: React.FC<PedidoCardProps> = ({ pedido, cambiarEstadoPedido, btnTikect, phat }) => {
    const [EstadoPedido,setEstadoPedido]=useState<EstadoPedido>();

    const handleCancel = () => {
        pedido.EstadoPedido.descripcion = "Cancelado";
        setEstadoPedido(pedido.EstadoPedido);
    }


    const handleChage=(estado:string)=>{
        cambiarEstadoPedido(estado);
        setEstadoPedido(pedido.EstadoPedido);
    }

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
                            <EstadoPedidoCard estado={pedido.EstadoPedido.descripcion} />
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                            {btnTikect === true && (
                                <>
                                    <Link to={`/factura/${pedido.idPedido}/${phat}`} className="btn btn-primary me-2">
                                        Ticket
                                    </Link>
                                </>
                            )}
                            {pedido.EstadoPedido.descripcion === "A confirmar" && (
                                <>
                                    <button className="btn btn-primary me-2" onClick={() => handleChage("A cocina")} disabled={pedido.TipoEntregaPedido.descripcion === "Retiro en local"}>
                                        A cocina
                                    </button>
                                    <button className="btn btn-primary" onClick={() => handleChage("Listo")}>
                                        Listo
                                    </button>
                                </>
                            )}
                            {pedido.EstadoPedido.descripcion === "Listo" && (
                                <>
                                    <button
                                        className="btn btn-primary me-2"
                                        onClick={() => handleChage("En delivery")}
                                        disabled={pedido.TipoEntregaPedido.descripcion !== "Envío a domicilio" || pedido.TipoPago.descripcion !== "Pago realizado"}
                                    >
                                        En delivery
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleChage("Entregado")}
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
                                        onClick={() => handleChage("Entregado")}
                                        disabled={pedido.TipoEntregaPedido.descripcion !== "Retiro en local" || pedido.TipoPago.descripcion !== "Pago realizado"}
                                    >
                                        Entregado
                                    </button>
                                </>
                            )}
                            {pedido.EstadoPedido.descripcion!=="Cancelado" &&(
                                <button
                                    className="btn btn-primary"
                                    onClick={() => handleCancel()}
                                    disabled={pedido.EstadoPedido.descripcion === "Cancelado"}
                                >
                                    Cancelar
                                </button>
                            )}

                        </div>
                    </Col>
                </Row>
            </Card.Body>
        </Card>
    );
};

export default PedidoCard;
