import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Rubro } from '../../../interface/Rubro';
import { EditRubroIngredientesModalProps } from '../../../interface/Ingredientes';


const EditRubroIngredientesModal: React.FC<EditRubroIngredientesModalProps> = ({
  show,
  handleClose,
  handleRubroEdit,
  selectedRubro,
}) => {
  const [nombre, setNombre] = useState(selectedRubro?.nombre || '');
  const [rubroId, setRubroId] = useState<number | null>(selectedRubro?.idRubro || null);
  const [rubros, setRubros] = useState<Rubro[]>([]);

  useEffect(() => {
    fetch('/assets/data/rubrosIngredientesEjemplo.json')
      .then((response) => response.json())
      .then((data) => {
        setRubros(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setNombre(selectedRubro?.nombre || '');
    setRubroId(selectedRubro?.idRubro || null);
  }, [selectedRubro]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedRubro) {
      const updatedRubro: Rubro = {
        idRubro: selectedRubro.idRubro,
        nombre,
        idRubroPadre: selectedRubro.idRubroPadre,
      };
      handleRubroEdit(updatedRubro);
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Rubro</Modal.Title>
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

export default EditRubroIngredientesModal;
