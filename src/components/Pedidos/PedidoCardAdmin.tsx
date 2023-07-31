import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Pedido } from '../../interface/Pedido';
import { Link } from 'react-router-dom';
import EstadoPedidoCard from './EstadoPedidoCard';
import axios from 'axios';

interface PedidoCardAdminProps {
  pedido: Pedido;
  cambiarEstadoPedido: (nuevoEstado: string) => void;
}

const PedidoCardAdmin: React.FC<PedidoCardAdminProps> = ({ pedido, cambiarEstadoPedido }) => {

  const urlDetallePedido = `/mis-pedido/${pedido.idPedido}`;

  const handleEstadoPedidoChange = async (nuevoEstado: string) => {
    if (pedido.esDelivery) {
      if ((pedido.estadoPedido === "A confirmar" && nuevoEstado === "A cocina") ||
        (pedido.estadoPedido === "A confirmar" && nuevoEstado === "Listo") ||
        (pedido.estadoPedido === "Listo" && nuevoEstado === "En delivery" && pedido.esEfectivo) ||
        (pedido.estadoPedido === "Listo" && nuevoEstado === "Entregado" && pedido.esEfectivo)) {

        try {
          const response = await axios.put(`/api/pedidos/${pedido.idPedido}`, { estadoPedido: nuevoEstado }); //cambiar la url 
          cambiarEstadoPedido(response.data.estadoPedido);
          console.log("envio al back"); //prueba de envio
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      cambiarEstadoPedido(nuevoEstado);
    }
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
              {pedido.estadoPedido === 'A confirmar' && (
                <>
                  <Link to={urlDetallePedido} className="btn btn-primary me-2">
                    <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
                  </Link>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleEstadoPedidoChange('A cocina')}
                    disabled={pedido.esDelivery === false}
                  >
                    A cocina
                  </button>
                  <button className="btn btn-primary" onClick={() => handleEstadoPedidoChange('Listo')}>
                    Listo
                  </button>
                </>
              )}
              {pedido.estadoPedido === 'Listo' && (
                <>
                  <Link to={urlDetallePedido} className="btn btn-primary me-2">
                    <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
                  </Link>
                  <button
                    className="btn btn-primary me-2"
                    onClick={() => handleEstadoPedidoChange('En delivery')}
                    disabled={pedido.esDelivery === false || !pedido.esEfectivo}
                  >
                    En delivery
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEstadoPedidoChange('Entregado')}
                    disabled={pedido.esDelivery === true || !pedido.esEfectivo}
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
                    onClick={() => handleEstadoPedidoChange('Entregado')}
                    disabled={pedido.esDelivery === false || !pedido.esEfectivo}
                  >
                    Entregado
                  </button>
                </>
              )}
              {pedido.estadoPedido === 'Entregado' && (
                <>
                  <Link to={`/mis-pedido/${pedido.idPedido}`} className="btn btn-primary me-2">
                    Ver detalles
                  </Link>
                </>
              )}
              {pedido.estadoPedido === 'Cancelado' && (
                <>
                  <Link to={`/mis-pedido/${pedido.idPedido}`} className="btn btn-primary me-2">
                    Ver detalles
                  </Link>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default PedidoCardAdmin;
