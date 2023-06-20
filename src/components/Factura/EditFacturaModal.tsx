import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Pedido } from '../../interface/Pedido';

interface EditFacturaModalProps {
  show: boolean;
  handleClose: () => void;
  handleFacturaEdit: (factura: Pedido) => void;
  selectedFactura: Pedido | null;
}

const EditFacturaModal: React.FC<EditFacturaModalProps> = ({
  show,
  handleClose,
  handleFacturaEdit,
  selectedFactura,
}) => {
  const [numeroPedido, setNumeroPedido] = useState(0);
  const [fechaPedido, setFechaPedido] = useState(new Date());
  const [horaEstimadaFin, setHoraEstimadaFin] = useState(new Date());
  const [esDelivery, setEsDelivery] = useState(false);
  const [estadoPedido, setEstadoPedido] = useState('');
  const [esEfectivo, setEsEfectivo] = useState(false);
  const [totalPedido, setTotalPedido] = useState(0);

  useEffect(() => {
    if (selectedFactura) {
      setNumeroPedido(selectedFactura.numeroPedido);
      setFechaPedido(selectedFactura.fechaPedido);
      setHoraEstimadaFin(selectedFactura.horaEstimadaFin);
      setEsDelivery(selectedFactura.esDelivery);
      setEstadoPedido(selectedFactura.estadoPedido);
      setEsEfectivo(selectedFactura.esEfectivo);
      setTotalPedido(selectedFactura.totalPedido);
    }
  }, [selectedFactura]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedFactura) {
      const updatedFactura: Pedido = {
        ...selectedFactura,
        numeroPedido,
        fechaPedido,
        horaEstimadaFin,
        esDelivery,
        estadoPedido,
        esEfectivo,
        totalPedido,
      };
      handleFacturaEdit(updatedFactura);
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Factura</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formNumeroPedido">
            <Form.Label>Número de Pedido</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese número de pedido"
              value={numeroPedido}
              onChange={(event) => setNumeroPedido(parseInt(event.target.value))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formFechaPedido">
            <Form.Label>Fecha de Pedido</Form.Label>
            <Form.Control
              type="date"
              value={fechaPedido.toISOString().substr(0, 10)}
              onChange={(event) => setFechaPedido(new Date(event.target.value))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formHoraEstimadaFin">
            <Form.Label>Hora Estimada de Fin</Form.Label>
            <Form.Control
              type="time"
              value={horaEstimadaFin.toISOString().substr(0, 5)}
              onChange={(event) => setHoraEstimadaFin(new Date(`2000-01-01T${event.target.value}:00Z`))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEsDelivery">
            <Form.Check
              type="checkbox"
              label="Es Delivery"
              checked={esDelivery}
              onChange={(event) => setEsDelivery(event.target.checked)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEstadoPedido">
            <Form.Label>Estado del Pedido</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese estado del pedido"
              value={estadoPedido}
              onChange={(event) => setEstadoPedido(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEsEfectivo">
            <Form.Check
              type="checkbox"
              label="Es Efectivo"
              checked={esEfectivo}
              onChange={(event) => setEsEfectivo(event.target.checked)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTotalPedido">
            <Form.Label>Total del Pedido</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese total del pedido"
              value={totalPedido}
              onChange={(event) => setTotalPedido(parseFloat(event.target.value))}
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit">
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditFacturaModal;
