import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { IPedido } from '../../interface/IPedido';

interface EditFacturaModalProps {
  show: boolean;
  handleClose: () => void;
  handleFacturaEdit: (factura: IPedido) => void;
  selectedFactura: IPedido | null;
}

const EditFacturaModal: React.FC<EditFacturaModalProps> = ({
  show,
  handleClose,
  handleFacturaEdit,
  selectedFactura,
}) => {
  const [numeroPedido, setNumeroPedido] = useState(0);
  const [fechaPedido, setFechaPedido] = useState('');
  const [horaEstimadaFin, setHoraEstimadaFin] = useState('');
  const [esDelivery, setEsDelivery] = useState(false);
  const [estadoPedido, setEstadoPedido] = useState('');
  const [esEfectivo, setEsEfectivo] = useState(false);
  const [totalPedido, setTotalPedido] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedFactura) {
      setNumeroPedido(selectedFactura.numeroPedido);
      setFechaPedido(selectedFactura.fechaPedido instanceof Date ? selectedFactura.fechaPedido.toISOString().split('T')[0] : '');
      setHoraEstimadaFin(selectedFactura.horaEstimadaFin instanceof Date ? selectedFactura.horaEstimadaFin.toISOString().split('T')[1].substring(0, 5) : '');
      setEsDelivery(selectedFactura.esDelivery);
      setEstadoPedido(selectedFactura.estadoPedido);
      setEsEfectivo(selectedFactura.esEfectivo);
    }
  }, [selectedFactura]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedFactura) {
      // Validar los campos antes de guardar los cambios
      if (!isValidForm()) {
        setError('Por favor, complete todos los campos correctamente.');
        return;
      }

      const updatedFactura: IPedido = {
        ...selectedFactura,
        numeroPedido,
        fechaPedido: new Date(fechaPedido),
        horaEstimadaFin: new Date(`2000-01-01T${horaEstimadaFin}:00Z`), // Agregar una fecha ficticia para el tiempo
        esDelivery,
        estadoPedido,
        esEfectivo,
      };
      handleFacturaEdit(updatedFactura);
    }
    handleClose();
  };

  const isValidForm = () => {
    return (
      numeroPedido > 0 &&
      fechaPedido !== '' &&
      horaEstimadaFin !== '' &&
      estadoPedido !== '' &&
      totalPedido > 0
    );
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Factura</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
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
              value={fechaPedido}
              onChange={(event) => setFechaPedido(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formHoraEstimadaFin">
            <Form.Label>Hora Estimada de Fin</Form.Label>
            <Form.Control
              type="time"
              value={horaEstimadaFin}
              onChange={(event) => setHoraEstimadaFin(event.target.value)}
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
