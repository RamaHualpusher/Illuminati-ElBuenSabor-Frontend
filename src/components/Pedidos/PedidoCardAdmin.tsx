import React, { useEffect, useState, useContext } from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { IPedidoDto } from '../../interface/IPedido';
import { useLocation } from 'react-router-dom';
import EstadoPedidoCard from './EstadoPedidoCard';
import axios from 'axios';
import ModalDetallePedido from './ModalDetallePedido';
import { IDetallePedido } from '../../interface/IDetallePedido';
import { useUser } from '../../context/User/UserContext';

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
  const { usuarioContext } = useUser();

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
      setActualizarUI(false);
    }
  }, [actualizarUI, pedido.id]);

  const handleMostrarDetalles = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const contieneOtrosProductos = (detallesPedidos: IDetallePedido[]): boolean => {
    for (const detallePedido of detallesPedidos) {
      if (!detallePedido.producto.esBebida) {
        return true;
      }
    }
    return false;
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
        if (pedido.estadoPedido !== nuevoEstado && nuevoEstado != null) {
          pedido.estadoPedido = nuevoEstado;
        }
        const response = await axios.put(`${API_URL}pedido/${pedido.id}`, pedido);

        cambiarEstadoPedido(response.data.estadoPedido);
        //window.location.reload();

        setActualizarUI(true);
      } catch (error) {
        console.error(error);
      }
    }
  };

  const renderActionButtons = () => {
    if (!usuarioContext) return null;

    const tieneOtrosProductos = contieneOtrosProductos(pedido.detallesPedidos);
    const isCajero = usuarioContext.rol.nombreRol === 'Cajero';
    const isCocinero = usuarioContext.rol.nombreRol === 'Cocinero';
    const isDelivery = usuarioContext.rol.nombreRol === 'Delivery';

    switch (pedido.estadoPedido) {
      case 'A confirmar':
        return (
          <>
            <Button className='mx-2' variant="primary" onClick={handleMostrarDetalles}>
              <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
            </Button>
            {isCajero && tieneOtrosProductos ? (
              <button className="btn btn-primary me-2" onClick={() => handleEstadoPedidoChange('En cocina')}>
                A cocina
              </button>
            ) : (
              <button className="btn btn-primary" onClick={() => handleEstadoPedidoChange('Listo')} disabled={!pedido.detallesPedidos.every((detalle) => detalle.producto.esBebida)}>
                Listo
              </button>
            )}
          </>
        );
      case 'En cocina':
        return (
          <>
            <Button className='mx-2' variant="primary" onClick={handleMostrarDetalles}>
              <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
            </Button>
            {isCocinero && (
              <button className="btn btn-primary" onClick={() => handleEstadoPedidoChange('Listo')}>
                Listo
              </button>
            )}
          </>
        );
      case 'Listo':
        return (
          <>
            <Button className='mx-2' variant="primary" onClick={handleMostrarDetalles}>
              <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
            </Button>
            {isCajero && (
              <button className="btn btn-primary me-2" onClick={handlePagoConfirmacion} disabled={!pedido.esEfectivo}>
                Entregado
              </button>
            )}
            {isDelivery && (
              <button className="btn btn-primary" onClick={() => handleEstadoPedidoChange('En delivery')}>
                En delivery
              </button>
            )}
          </>
        );
      case 'En delivery':
        return (
          <>
            <Button className='mx-2' variant="primary" onClick={handleMostrarDetalles}>
              <i className="bi bi-file-earmark-text-fill me-1"></i> Detalles
            </Button>
            {isDelivery && (
              <button className="btn btn-primary" onClick={() => handleEstadoPedidoChange('Entregado')}>
                Entregado
              </button>
            )}
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

  const isPagoMercadoPago = pedido.mercadoPagoDatos && pedido.mercadoPagoDatos.id;

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
      <ModalDetallePedido pedido={pedido} onHide={handleCloseModal} show={showModal} />
    </>
  );
};

export default PedidoCardAdmin;
