import React, { useEffect, useState } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import { IPedidoDtoVuelto } from '../../interface/IPedido';
import ModalModificarPedido from './ModalModificarPedido';

interface ModalDetallePedidoProps {
  pedido: IPedidoDtoVuelto; // Propiedad que recibe el pedido seleccionado
  onHide: () => void; // Función para cerrar el modal
  show: boolean; // Propiedad para controlar la visibilidad del modal
}

const ModalDetallePedido: React.FC<ModalDetallePedidoProps> = ({ pedido, onHide, show }) => {
  const detallesVacios = pedido.detallesPedidos.length === 0;
  const [noHayProductosConReceta, setNoHayProductosConReceta] = useState(true);
  const [showModificar, setShowModificar] = useState(false);

  useEffect(() => {
    const tieneProductosConReceta = pedido.detallesPedidos.some(
      (detalle) => !detalle.producto.esBebida
    );
    setNoHayProductosConReceta(!tieneProductosConReceta);
  }, [pedido]);

  const handleShowModificar = () => setShowModificar(true);
  const handleHideModificar = () => setShowModificar(false);

  const handlePedidoModificado = (pedidoModificado: IPedidoDtoVuelto) => {
    // Aquí puedes actualizar el estado del pedido o realizar otras acciones
    handleHideModificar();
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="lg" dialogClassName="modal-dialog-scrollable">
        <Modal.Header closeButton>
          <Modal.Title>Detalles del Pedido <span className='text-success'>#{pedido.id}</span></Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!detallesVacios ? (
            <>
              <h2>Cliente</h2>
              <ul>
                <li><span className='text-capitalize fs-4 fw-semibold text-secondary'>{pedido.usuario.nombre} {pedido.usuario.apellido}</span></li>
                <li>Domicilio: {(pedido.usuario.domicilio) ? (` ${pedido.usuario.domicilio?.localidad} ${pedido.usuario.domicilio?.calle} ${pedido.usuario.domicilio?.numero}`) : <span className='text-danger-emphasis'>Domicilio no disponible</span>}</li>
                <li>Teléfono: {(pedido.usuario.telefono) ? pedido.usuario.telefono : <span className='text-danger-emphasis'>Teléfono no disponible</span>}</li>
                <li>Email: {(pedido.usuario.email) ? pedido.usuario.email : <span className='text-danger-emphasis'>Email no disponible</span>}</li>
              </ul>
              <hr />
              <h2>Productos</h2>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {pedido.detallesPedidos.map((detalle, index) => (
                    <tr key={index}>
                      <td>{detalle.producto.nombre}</td>
                      <td>{detalle.cantidad}</td>
                      <td>{detalle.producto.precio * detalle.cantidad}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={1}></td>
                    <td><b>Total</b></td>
                    <td className='text-success'>
                      <b>
                        {pedido.detallesPedidos.reduce(
                          (total, detalle) => total + detalle.producto.precio * detalle.cantidad,
                          0
                        )}
                      </b>
                    </td>
                  </tr>
                </tbody>
              </Table>
              <h3>Más detalles</h3>
              <ul>
                <li><span className='text-secondary'><i className="bi bi-clock"></i> Fecha y hora del pedido:{' '}
                  {new Date(pedido.fechaPedido).toLocaleString()}</span></li>
                <li><span className='text-secondary'><i className="bi bi-clock"></i> Hora estimada fin:{' '}
                  {new Date(pedido.horaEstimadaFin).toLocaleString()}</span></li>
                <li><span className='text-secondary'> Estado pedido: {pedido.estadoPedido}</span></li>
                <li><span className='text-secondary'> Tipo de pago: {
                  (pedido.esEfectivo) ?
                    <span className='text-success'>Efectivo</span>
                    :
                    <span className='text-primary'>Mercado Pago</span>
                }</span></li>
                <li><span className='text-secondary'> Tipo de entrega: {
                  (pedido.esDelivery) ?
                    <span className='text-success'>Delivery</span>
                    :
                    <span className='text-primary'>Take Away</span>
                }</span></li>
              </ul>
              {!noHayProductosConReceta && (
                <>
                  <h3>Recetas:</h3>
                  <ul>
                    {pedido.detallesPedidos.map((detalle, index) => (
                      !detalle.producto.esBebida && (
                        <li key={index}>
                          <span className='text-secondary'>{detalle.producto.nombre}: </span>{' '}
                          {detalle.producto.preparacion}
                        </li>
                      )
                    ))}
                  </ul>
                </>
              )}
            </>
          ) : (
            <div className="text-center text-danger">
              <i className="bi bi-exclamation-triangle-fill"></i> No hay detalles disponibles.
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          {!pedido.devuelto &&(
            <Button variant="info" onClick={handleShowModificar}>
            Cancelar Pedido
          </Button>
          )}          
          <Button variant="secondary" onClick={onHide}>
            Volver
          </Button>
        </Modal.Footer>
      </Modal>

      <ModalModificarPedido
        pedido={pedido}
        show={showModificar}
        onHide={handleHideModificar}
        onSave={handlePedidoModificado}
      />
    </>
  );
};

export default ModalDetallePedido;
