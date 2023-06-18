import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Pedido } from '../../interface/Pedido';
import { Link } from 'react-router-dom';

interface PedidoCardProps {
  pedido: Pedido;
  cambiarEstadoPedido: (nuevoEstado: string) => void;
  btnTikect: boolean;
  phat: string;
}

const PedidoCard: React.FC<PedidoCardProps> = ({ pedido, cambiarEstadoPedido, btnTikect, phat }) => {
  return (
    <Card className="pedido-card mb-2">
      <Card.Body>
        <Row>
          <Col sm={4}>
            <Card.Text>Pedido Número: {pedido.numeroPedido}</Card.Text>
            <Card.Text>
              <i className="bi bi-clock"></i>
              {pedido.horaEstimadaFin ? new Date(pedido.horaEstimadaFin).toLocaleTimeString() : ''} - {pedido.tipoEnvio}
            </Card.Text>
            <Card.Text>{new Date(pedido.fechaPedido).toLocaleDateString()}</Card.Text>
          </Col>
          <Col sm={8}>
            <div className="d-flex align-items-center justify-content-end">
              {/* <EstadoPedido estado={pedido.estadoPedido} />  */}
            </div>
            <div className="d-flex justify-content-end mt-3">
              {btnTikect === true && (
                <>
                  <Link to={`/factura/${pedido.idPedido}/${phat}`} className="btn btn-primary me-2">
                    Ticket
                  </Link>
                </>
              )}
              {pedido.estadoPedido === 'A confirmar' && (
                <>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => cambiarEstadoPedido('A cocina')}
                    disabled={pedido.tipoEnvio === 'Retiro en local'}
                  >
                    A cocina
                  </button>
                  <button className="btn btn-primary" onClick={() => cambiarEstadoPedido('Listo')}>
                    Listo
                  </button>
                </>
              )}
              {pedido.estadoPedido === 'Listo' && (
                <>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => cambiarEstadoPedido('En delivery')}
                    disabled={pedido.tipoEnvio !== 'Envío a domicilio' || !pedido.esEfectivo}
                  >
                    En delivery
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => cambiarEstadoPedido('Entregado')}
                    disabled={pedido.tipoEnvio !== 'Retiro en local' || !pedido.esEfectivo}
                  >
                    Entregado
                  </button>
                </>
              )}
              {pedido.estadoPedido === 'En delivery' && (
                <>
                  <Link to={`/pedido/${pedido.idPedido}`} className="btn btn-primary me-2">
                    Ver detalles
                  </Link>
                  <button
                    className="btn btn-primary"
                    onClick={() => cambiarEstadoPedido('Entregado')}
                    disabled={pedido.tipoEnvio !== 'Retiro en local' || !pedido.esEfectivo}
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
