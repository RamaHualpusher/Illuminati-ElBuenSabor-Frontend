import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { IIngredientes, IEditCompraIngredientesModalProps } from '../../../interface/IIngredientes';

const EditCompraIngredientesModal: React.FC<IEditCompraIngredientesModalProps> = ({
  show,
  handleClose,
  handleIngredientesEdit,
  ingredientesBajoStock,
}) => {
  const [selectedIngrediente, setSelectedIngrediente] = useState<IIngredientes | null>(null);
  const [cantidad, setCantidad] = useState(0);
  const [mostrarMensaje, setMostrarMensaje] = useState(false);
  
  useEffect(() => {
    if (show) {
      resetFormFields();
    }
  }, [show]);

  const resetFormFields = () => {
    setSelectedIngrediente(null);
    setCantidad(0);
    setMostrarMensaje(false);
  };

  const handleIngredienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const ingredienteId = parseInt(e.target.value);
    const ingredienteSelect = ingredientesBajoStock.find(ingrediente => ingrediente.id === ingredienteId);
    setSelectedIngrediente(ingredienteSelect || null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (cantidad <= 0) {
      setMostrarMensaje(true);
      return;
    }

    if (selectedIngrediente) {
      const stockUpdated = calculateStockFromAmountAndUnit(cantidad, selectedIngrediente.unidadMedida);
      const editedIngredientes: IIngredientes = {
        ...selectedIngrediente,
        stockActual: selectedIngrediente.stockActual + stockUpdated,
        precioCosto: selectedIngrediente.precioCosto,
        activo: selectedIngrediente.activo,
      };

      try {
        await handleIngredientesEdit(cantidad, editedIngredientes);
        resetFormFields();
        handleClose();
      } catch (error) {
        console.error('Error al editar ingredientes:', error);
      }
    }
  };

  const calculateStockFromAmountAndUnit = (amount: number, unit: string): number => {
    switch (unit) {
      case 'Kg':
        return amount * 1000;
      case 'g':
        return amount;
      case 'mg':
        return amount / 1000;
      case 'L':
        return amount * 1000;
      case 'ml':
        return amount;
      default:
        return 0;
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Compra de Ingredientes</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={7}>
              <Form.Group controlId="formIngrediente">
                <Form.Label>Seleccionar Ingrediente</Form.Label>
                <Form.Select
                  value={selectedIngrediente?.id || ''}
                  onChange={handleIngredienteChange}
                  required
                >
                  <option value="">Seleccione un ingrediente</option>
                  {ingredientesBajoStock.map(ingrediente => (
                    <option key={ingrediente.id} value={ingrediente.id}>
                      {ingrediente.nombre}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3" controlId="formEstado">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={selectedIngrediente?.activo ? 'alta' : 'baja'}
                  required
                >
                  <option value="alta">Alta</option>
                  <option value="baja">Baja</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={5}>
              <Form.Group controlId="formCantidad">
                <Form.Label>Cantidad</Form.Label>
                <Form.Control
                  type="number"
                  value={cantidad}
                  onChange={(e) => setCantidad(parseInt(e.target.value))}
                  required
                  isInvalid={mostrarMensaje}
                />
                {mostrarMensaje &&
                  <Form.Control.Feedback type='invalid'>
                    La cantidad tiene que ser mayor a Cero
                  </Form.Control.Feedback>}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formPrecioCosto">
                <Form.Label>Precio de Costo</Form.Label>
                <Form.Control
                  type="number"
                  plaintext
                  value={selectedIngrediente?.precioCosto || 0}
                  readOnly
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group controlId="formUM">
                <Form.Label>Unidad de Medida</Form.Label>
                <Form.Control
                  plaintext
                  readOnly
                  value={selectedIngrediente?.unidadMedida || ''}
                />
              </Form.Group>
            </Col>
          </Row>
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

export default EditCompraIngredientesModal;
