import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Pedido } from '../../../interface/Pedido';
import { Link } from 'react-router-dom';
import EstadoPedidoCard from '../../Pedidos/EstadoPedidoCard';

interface PedidoCardUsuarioProps {
    pedido: Pedido;
}

const PedidoCardUsuario: React.FC<PedidoCardUsuarioProps> = ({ pedido }) => {
    // URL para el detalle del pedido
    const urlDetallePedido = `/mis-pedido/${pedido.idPedido}`;

    // Función para manejar la acción de "ver"
    const onView = () => {
        const encodedPedido = encodeURIComponent(JSON.stringify(pedido));
        window.open(`/factura/${encodedPedido}`, "_blank");
        window.postMessage(pedido, "*");
    };

    return (
        <Card className="pedido-card mb-2">
            <Card.Body>
                <Row>
                    <Col sm={4}>
                        <Card.Text>Pedido Número: {pedido.numeroPedido}</Card.Text>
                        <Card.Text>
                            <i className="bi bi-clock"></i>
                            {pedido.horaEstimadaFin ? new Date(pedido.horaEstimadaFin).toLocaleTimeString() : ''} - {pedido.esDelivery ? 'Delivery' : 'Retiro Local'}
                        </Card.Text>
                        <Card.Text>{new Date(pedido.fechaPedido).toLocaleDateString()}</Card.Text>
                    </Col>
                    <Col sm={8}>
                        <div className="d-flex align-items-center justify-content-end">
                            <EstadoPedidoCard estado={pedido.estadoPedido} />
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                            {['Listo', 'Pagado', 'A confirmar', 'En cocina', 'En delivery', 'Entregado', 'Cancelado'].includes(pedido.estadoPedido) && (
                                // Mostrar botones solo para ciertos estados de pedido
                                <>
                                    <Link to={urlDetallePedido} className="btn btn-primary me-2">
                                        <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
                                    </Link>
                                    <button className="btn btn-primary me-2" onClick={onView}>
                                        <i className="bi bi-receipt me-1"></i> Factura
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

export default PedidoCardUsuario;
