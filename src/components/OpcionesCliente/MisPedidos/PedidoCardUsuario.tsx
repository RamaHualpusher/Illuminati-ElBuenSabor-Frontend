import React, { useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { IPedidoDto } from '../../../interface/IPedido';
import EstadoPedidoCard from '../../Pedidos/EstadoPedidoCard';
import GenerarTicket from '../../Ticket/GenerarTicket';
import { IDetallePedido } from '../../../interface/IDetallePedido';
import { IProducto } from '../../../interface/IProducto';

interface PedidoCardUsuarioProps {
    pedido: IPedidoDto;
}

const PedidoCardUsuario: React.FC<PedidoCardUsuarioProps> = ({ pedido }) => {
    // URL para el detalle del pedido
    const urlDetallePedido = `/mis-pedido/${pedido.id}`;
    const [showGenerarTicket, setShowGenerarTicket] = useState(false);

    // Función para calcular el subtotal del pedido
    const obtenerSubtotal = (detallePedido: IDetallePedido[]) => {
        let subtotal = 0;
        detallePedido.forEach((detalle: IDetallePedido) => {
            subtotal += detalle.producto.precio * detalle.cantidad;
        });
        return subtotal;
    };

    // Función para calcular el total del pedido
    const calcularTotalPedido = () => {
        const subtotal = obtenerSubtotal(pedido.detallesPedidos);
        return pedido.esDelivery ? subtotal + 500 : subtotal * 0.9;
    };   

    return (
        <Card className="pedido-card mb-2">
            <Card.Body>
                <Row>
                    <Col sm={4}>
                        <Card.Text>Pedido Número: {pedido.id}</Card.Text>
                        <Card.Text>
                            <i className="bi bi-clock"></i>
                            {pedido.horaEstimadaFin ? new Date(pedido.horaEstimadaFin).toLocaleTimeString() : ''} - {pedido.esDelivery ? 'Delivery' : 'Retiro Local'}
                        </Card.Text>
                        <Card.Text>{new Date(pedido.fechaPedido).toLocaleDateString()}</Card.Text>
                        <Card.Text><b>Total: </b> ${calcularTotalPedido().toFixed(2)}</Card.Text>
                    </Col>
                    <Col sm={8}>
                        <div className="d-flex align-items-center justify-content-end">
                            <EstadoPedidoCard estado={pedido.estadoPedido} />
                        </div>
                        <div className="d-flex justify-content-end mt-3">
                            {['Listo', 'Pagado', 'A confirmar', 'En cocina', 'En delivery', 'Entregado', 'Cancelado'].includes(pedido.estadoPedido) && (
                                // Mostrar botones solo para ciertos estados de pedido
                                <>
                                    <Button variant="primary" className="me-2" onClick={() => setShowGenerarTicket(true)}>
                                        <i className="bi bi-file-earmark-text-fill me-1"></i> Detalle pedido
                                    </Button>
                                </>
                            )}
                        </div>
                    </Col>
                </Row>
            </Card.Body>
            <GenerarTicket pedido={pedido} closeModal={() => setShowGenerarTicket(false)} show={showGenerarTicket} />
        </Card>
    );
};

export default PedidoCardUsuario;
