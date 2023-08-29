import React, { useEffect, useState } from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { Pedido } from '../../interface/Pedido';
import { Link, useLocation } from 'react-router-dom';
import EstadoPedidoCard from './EstadoPedidoCard';
import axios from 'axios';

interface PedidoCardAdminProps {
  pedido: Pedido;
  cambiarEstadoPedido: (nuevoEstado: string) => void;
}

const PedidoCardAdmin: React.FC<PedidoCardAdminProps> = ({ pedido, cambiarEstadoPedido }) => {
  const [urlDetallePedido, setUrlDetallePedido] = useState(``);
  const location = useLocation();


  useEffect(() => {
    let newUrlDetallePedido = '';
    switch (location.pathname) {
      case '/cocinero':
        newUrlDetallePedido = `/cocinero/pedido/${pedido.idPedido}`;
        break;
      case '/delivery':
        newUrlDetallePedido = `/pedido/${pedido.idPedido}`;
        break;
      case '/cajero':
        newUrlDetallePedido = `/cajero/pedido/${pedido.idPedido}`;
        break;
      default:
        break;
    }
    setUrlDetallePedido(newUrlDetallePedido);
  }, [location.pathname, pedido.idPedido]);

  const handleEstadoPedidoChange = async (nuevoEstado: string) => {
    // Lógica para cambiar el estado del pedido y actualizarlo en la base de datos
    if (pedido.esDelivery) {
      console.log("validando..");

      const validChanges =
        (pedido.estadoPedido === 'A confirmar' && nuevoEstado === 'En cocina') ||
        (pedido.estadoPedido === 'En cocina' && nuevoEstado === 'Listo') ||
        (pedido.estadoPedido === 'A confirmar' && nuevoEstado === 'Listo') ||
        (pedido.estadoPedido === 'Listo' && nuevoEstado === 'En delivery' && !pedido.esEfectivo) ||
        (pedido.estadoPedido === 'En delivery' && nuevoEstado === 'Entregado' && !pedido.esEfectivo);
      console.log("no valido");
      if (validChanges) {
        try {
          const response = await axios.put(`/api/pedidos/${pedido.idPedido}`, { estadoPedido: nuevoEstado });
          cambiarEstadoPedido(response.data.estadoPedido);
          console.log('envio put al back'); //prueba de envio
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      console.log("validando..")
      console.log(location.pathname);
      const validChanges =
        (pedido.estadoPedido === 'A confirmar' && nuevoEstado === 'En cocina') ||
        (pedido.estadoPedido === 'En cocina' && nuevoEstado === 'Listo') ||
        (pedido.estadoPedido === 'A confirmar' && nuevoEstado === 'Listo') ||
        (pedido.estadoPedido === 'Listo' && nuevoEstado === 'Entregado');
      console.log("no valido 2");
      if (validChanges) {
        try {
          const response = await axios.put(`/api/pedidos/${pedido.idPedido}`, { estadoPedido: nuevoEstado });
          cambiarEstadoPedido(response.data.estadoPedido);
          console.log('envio put al back 2'); //prueba de envio
        } catch (error) {
          console.error(error);
        }
      }
    }
  };

  const renderActionButtons = () => {
    // Definir los botones y su comportamiento según el estado del pedido
    switch (pedido.estadoPedido) {
      case 'A confirmar':
        return (
          <>
            <Link to={urlDetallePedido} className="btn btn-primary me-2">
              <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
            </Link>
            <button className="btn btn-primary me-2" onClick={() => handleEstadoPedidoChange('A cocina')} disabled={!pedido.esDelivery}>
              A cocina
            </button>
            <button className="btn btn-primary" onClick={() => handleEstadoPedidoChange('Listo')}>
              Listo
            </button>
          </>
        );
      case 'Listo':
        return (
          <>
            <Link to={urlDetallePedido} className="btn btn-primary me-2">
              <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
            </Link>
            <button className="btn btn-primary me-2" onClick={() => handleEstadoPedidoChange('En delivery')} disabled={!pedido.esDelivery || pedido.esEfectivo}>
              En delivery
            </button>
            <button className="btn btn-primary" onClick={() => handleEstadoPedidoChange('Entregado')} disabled={pedido.esDelivery || pedido.esEfectivo}>
              Entregado
            </button>
          </>
        );
      case 'En delivery':
        return (
          <>
            <Link to={urlDetallePedido} className="btn btn-primary me-2">
              <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
            </Link>
            <button className="btn btn-primary" onClick={() => handleEstadoPedidoChange('Entregado')} disabled={pedido.esEfectivo}>
              Entregado
            </button>
          </>
        );
      case 'Entregado':
        return (
          <>
            <Link to={urlDetallePedido} className="btn btn-primary me-2">
              <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
            </Link>
          </>
        );

      case 'En cocina':
        return (
          <>
            <Link to={urlDetallePedido} className="btn btn-primary me-2">
              <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
            </Link>
            <button className="btn btn-primary" onClick={() => handleEstadoPedidoChange('Listo')}>
              Listo
            </button>
          </>
        );
      default:
        return (
          <>
            <Link to={urlDetallePedido} className="btn btn-primary me-2">
              <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
            </Link>
          </>
        );
    }
  };

  return (
    <Card className="pedido-card mb-2">
      <Card.Body>
        <Row>
          <Col sm={4}>
            <Card.Text>Pedido Número: {pedido.numeroPedido}</Card.Text>
            <Card.Text>
              <i className="bi bi-clock"></i>{' '}
              {pedido.horaEstimadaFin ? new Date(pedido.horaEstimadaFin).toLocaleTimeString('es-AR') : ''} - {pedido.esDelivery ? 'Delivery' : 'Retiro Local'}
            </Card.Text>
            <Card.Text>{new Date(pedido.fechaPedido).toLocaleDateString('es-AR')}</Card.Text>
          </Col>
          <Col sm={8}>
            <div className="d-flex align-items-center justify-content-end">
              <EstadoPedidoCard estado={pedido.estadoPedido} />
            </div>
            <div className="d-flex justify-content-end mt-3">{renderActionButtons()}</div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default PedidoCardAdmin;
