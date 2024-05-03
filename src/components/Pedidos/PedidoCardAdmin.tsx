import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { IPedidoDto } from '../../interface/IPedido';
import { Link, useLocation } from 'react-router-dom';
import EstadoPedidoCard from './EstadoPedidoCard';
import axios from 'axios';
import ModalDetallePedido from './ModalDetallePedido';
import { IDetallePedido } from '../../interface/IDetallePedido';

interface PedidoCardAdminProps {
  pedido: IPedidoDto;
  cambiarEstadoPedido: (nuevoEstado: string) => void;
}

const PedidoCardAdmin: React.FC<PedidoCardAdminProps> = ({ pedido, cambiarEstadoPedido }) => {
  const [urlDetallePedido, setUrlDetallePedido] = useState(``);
  const [actualizarUI, setActualizarUI] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const location = useLocation();
  const API_URL = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    let newUrlDetallePedido = '';
    switch (location.pathname) {
      case '/cocinero':
        newUrlDetallePedido = `/cocinero/pedido/${pedido.id}`;
        break;
      case '/delivery':
        newUrlDetallePedido = `/pedido/${pedido.id}`;
        break;
      case '/cajero':
        newUrlDetallePedido = `/cajero/pedido/${pedido.id}`;
        break;
      default:
        break;
    }
    setUrlDetallePedido(newUrlDetallePedido);
  }, [location.pathname, pedido.id]);

  useEffect(() => {
    // Lógica para cargar el estado actualizado del pedido desde el servidor
    const fetchPedidoActualizado = async () => {
      try {
        const response = await axios.get(`${API_URL}pedido/${pedido.id}`);
        cambiarEstadoPedido(response.data.estadoPedido);
      } catch (error) {
        console.error(error);
      }
    };

    if (actualizarUI) {
      fetchPedidoActualizado();
      setActualizarUI(false); // Restablecer el estado de actualización de la UI
    }
  }, [actualizarUI, pedido.id]);

  const handleMostrarDetalles = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const contieneOtrosProductos = (detallesPedidos: IDetallePedido[]): boolean => {
    // Iterar sobre cada detalle de pedido
    for (const detallePedido of detallesPedidos) {
      // Verificar si el producto no es una bebida
      if (!detallePedido.producto.esBebida) {
        return true; // Si encuentra un producto que no es bebida, retorna true
      }
    }
    return false; // Si no encuentra ningún producto que no sea bebida, retorna false
  };

  const handlePagoConfirmacion = () => {
    const confirmacionPago = window.confirm('¿El cliente ya pagó?');
    if (confirmacionPago) {
      handleEstadoPedidoChange('Entregado');
    }
  };

  const handleEstadoPedidoChange = async (nuevoEstado: string) => {
    const confirmacion = window.confirm(`¿Está seguro de que desea cambiar el estado del pedido a "${nuevoEstado}"?`);
    if (confirmacion) {
      try {
        console.log("Pedido a actualizar: ");
        console.log(JSON.stringify(pedido));
        console.log("Nuevo estado pedido: " + nuevoEstado);
        console.log("Estado actual del pedido: " + pedido.estadoPedido);
        if (pedido.estadoPedido !== nuevoEstado && nuevoEstado != null) {
          pedido.estadoPedido = nuevoEstado;
        }
        console.log("Pedido a actualizado antes del PUT: ");
        console.log(JSON.stringify(pedido));
        const response = await axios.put(`${API_URL}pedido/${pedido.id}`, pedido);

        cambiarEstadoPedido(response.data.estadoPedido);
        setActualizarUI(true); // Actualizar la UI después de la solicitud PUT
      } catch (error) {
        console.error(error);
      }
    }
  };
  const renderActionButtons = () => {
    switch (pedido.estadoPedido) {
      case 'A confirmar':
        return (
          <>
            <Button className='mx-2' variant="primary" onClick={handleMostrarDetalles}>
              <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
            </Button>
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
            <Button className='mx-2' variant="primary" onClick={handleMostrarDetalles}>
              <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
            </Button>
            <button className="btn btn-primary me-2" onClick={() => handleEstadoPedidoChange('En delivery')} disabled={!pedido.esDelivery || pedido.esEfectivo}>
              En delivery
            </button>
            <button className="btn btn-primary" onClick={handlePagoConfirmacion} disabled={pedido.esDelivery || !pedido.esEfectivo}>
              Entregado
            </button>
          </>
        );
      case 'En delivery':
        return (
          <>
            <Button className='mx-2' variant="primary" onClick={handleMostrarDetalles}>
              <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
            </Button>
            <button className="btn btn-primary" onClick={() => handleEstadoPedidoChange('Entregado')} disabled={pedido.esEfectivo}>
              Entregado
            </button>
          </>
        );
      case 'Entregado':
        return (
          <>
            <Button className='mx-2' variant="primary" onClick={handleMostrarDetalles}>
              <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
            </Button>
          </>
        );
      case 'En cocina': // Nuevo caso añadido basado en el componente CajeroPage
        return (
          <>
            <Button className='mx-2' variant="primary" onClick={handleMostrarDetalles}>
              <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
            </Button>
            <button className="btn btn-primary" onClick={() => handleEstadoPedidoChange('Listo')}>
              Listo
            </button>
          </>
        );
      default:
        return (
          <>
            <Button className='mx-2' variant="primary" onClick={handleMostrarDetalles}>
              <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
            </Button>
          </>
        );
    }
  };

  //aca se verifica con mercado pago el pago 
  const isPagoMercadoPago = pedido.mercadoPagoDatos && pedido.mercadoPagoDatos.payment_id;

  return (
    <>
      <Card className="pedido-card mb-2">
        <Card.Body>
          <Row>
            <Col sm={4}>
              <Card.Text><b>Pedido Número: </b>{pedido.id}</Card.Text>
              <Card.Text><b> Usuario: </b>{pedido.usuario.apellido + " " + pedido.usuario.nombre}</Card.Text>
              {pedido.detallesPedidos.every((detalle) => detalle.producto.esBebida) && (
                <Button variant="success" size="sm">Es sólo bebida</Button>
              )}

              {/* importante aca verificar payment_id con mercado pago, verificar traerlo */}
              {pedido.estadoPedido === 'Listo' && isPagoMercadoPago && (
                <Button className="btn btn-success" onClick={() => handleEstadoPedidoChange('En delivery')}>En Delivery</Button>
              )}
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
      {/* Modal para mostrar detalles del pedido */}
      <ModalDetallePedido pedido={pedido} onHide={handleCloseModal} show={showModal} />
    </>
  );
};

export default PedidoCardAdmin;
