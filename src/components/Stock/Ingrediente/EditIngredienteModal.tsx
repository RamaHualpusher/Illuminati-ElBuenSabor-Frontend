import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Ingredientes } from '../../../interface/Ingredientes';
import { Rubro } from '../../../interface/Rubro';

interface EditIngredientesModalProps {
  show: boolean;
  handleClose: () => void;
  handleIngredientesEdit: (ingredientes: Ingredientes) => void;
  selectedIngredientes: Ingredientes | null;
}

const EditIngredientesModal: React.FC<EditIngredientesModalProps> = ({
  show,
  handleClose,
  handleIngredientesEdit,
  selectedIngredientes,
}) => {
  const [nombre, setNombre] = useState(selectedIngredientes?.nombre || '');
  const [rubroId, setRubroId] = useState<number | null>(selectedIngredientes?.Rubro.idRubro || null);
  const [minStock, setMinStock] = useState(selectedIngredientes?.stockMinimo || 0);
  const [stockActual, setStockActual] = useState(selectedIngredientes?.stockActual || 0);
  const [estado, setEstado] = useState(selectedIngredientes?.estado || false);
  const [rubros, setRubros] = useState<Rubro[]>([]);

  useEffect(() => {
    fetch('/assets/data/rubrosIngredientessEjemplo.json')
      .then(response => response.json())
      .then(data => {
        setRubros(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setNombre(selectedIngredientes?.nombre || '');
    setRubroId(selectedIngredientes?.Rubro.idRubro || null);
    setMinStock(selectedIngredientes?.stockMinimo || 0);
    setStockActual(selectedIngredientes?.stockActual || 0);
    setEstado(selectedIngredientes?.estado || false);
  }, [selectedIngredientes]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedIngredientes) {
      const selectedRubro = rubros.find(rubro => rubro.idRubro === rubroId);

      const updatedIngredientes: Ingredientes = {
        idIngredientes: selectedIngredientes.idIngredientes,
        nombre,
        Rubro: selectedRubro || { idRubro: 0, nombre: '' },
        stockMinimo: minStock,
        stockActual,
        estado,
        unidadMedida: selectedIngredientes.unidadMedida,
        ProductoIngrediente: selectedIngredientes.ProductoIngrediente || [],
      };
      handleIngredientesEdit(updatedIngredientes);
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Ingredientes</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese nombre"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRubro">
            <Form.Label>Rubro</Form.Label>
            <Form.Select
              value={rubroId || ''}
              onChange={(event) => {
                setRubroId(parseInt(event.target.value));
              }}
              required
            >
              <option value="">Seleccione un rubro</option>
              {rubros.map((rubro) => (
                <option key={rubro.idRubro} value={rubro.idRubro}>
                  {rubro.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formMinStock">
            <Form.Label>Min Stock</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese stock mínimo"
              value={minStock}
              onChange={(event) => setMinStock(parseInt(event.target.value))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formStockActual">
            <Form.Label>Stock Actual</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese stock actual"
              value={stockActual}
              onChange={(event) => setStockActual(parseInt(event.target.value))}
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

export default EditIngredientesModal;
