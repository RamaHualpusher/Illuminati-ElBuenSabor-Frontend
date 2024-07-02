import React, { useState } from 'react';
import { Modal, Button, Table, FormControl } from 'react-bootstrap';
import axios from 'axios';
import { IPedidoDtoVuelto } from '../../interface/IPedido';
import { IDetallePedido } from '../../interface/IDetallePedido';

interface ModalModificarPedidoProps {
  pedido: IPedidoDtoVuelto; // Propiedad que recibe el pedido seleccionado
  onHide: () => void; // Función para cerrar el modal
  show: boolean; // Propiedad para controlar la visibilidad del modal
  onSave: (pedidoModificado: IPedidoDtoVuelto) => void; // Función para guardar los cambios del pedido
}

const ModalModificarPedido: React.FC<ModalModificarPedidoProps> = ({ pedido, onHide, show, onSave }) => {
  const [detallesPedidos, setDetallesPedidos] = useState<IDetallePedido[]>(pedido.detallesPedidos);

  const handleCantidadChange = (index: number, cantidad: number) => {
    const nuevosDetalles = [...detallesPedidos];
    nuevosDetalles[index].cantidad = cantidad;
    setDetallesPedidos(nuevosDetalles);
  };

  const handleSave = async () => {
    const pedidoModificado = { ...pedido, detallesPedidos };

    try {
      await axios.post('algo/prueba', pedidoModificado);
      onSave(pedidoModificado);
      onHide();
    } catch (error) {
      console.error('Error al modificar el pedido:', error);
    }
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" modal-dialog-scrollable>
      <Modal.Header closeButton>
        <Modal.Title>Modificar Pedido <span className='text-success'>#{pedido.id}</span></Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
            {detallesPedidos.map((detalle, index) => (
              <tr key={index}>
                <td>{detalle.producto.nombre}</td>
                <td>
                  <FormControl
                    type="number"
                    value={detalle.cantidad}
                    onChange={(e) => handleCantidadChange(index, Number(e.target.value))}
                  />
                </td>
                <td>{detalle.producto.precio * detalle.cantidad}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={1}></td>
              <td><b>Total</b></td>
              <td className='text-success'>
                <b>
                  {detallesPedidos.reduce(
                    (total, detalle) => total + detalle.producto.precio * detalle.cantidad,
                    0
                  )}
                </b>
              </td>
            </tr>
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Guardar Cambios
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalModificarPedido;
