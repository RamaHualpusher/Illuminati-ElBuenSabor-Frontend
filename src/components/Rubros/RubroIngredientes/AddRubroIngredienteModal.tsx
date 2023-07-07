import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Rubro } from '../../../interface/Rubro';
import { AddRubroIngredienteModalProps } from '../../../interface/Ingredientes';

const AddRubroIngredienteModal: React.FC<AddRubroIngredienteModalProps> = ({
  show,
  handleClose,
  handleRubroAdd,
}) => {
  const [nombre, setNombre] = useState('');
  const [rubroId, setRubroId] = useState<number | null>(null);
  const [rubros, setRubros] = useState<Rubro[]>([]);

  useEffect(() => {
    fetch('/assets/data/rubrosIngredientesEjemplo.json')
      .then(response => response.json())
      .then(data => {
        setRubros(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nombre || !rubroId || isNaN(rubroId)) {
      console.log('Todos los campos son obligatorios');
      return;
    }

    const selectedRubro = rubros.find((rubro) => rubro.idRubro === rubroId);
    if (!selectedRubro) {
      console.log('Rubro inválido');
      return;
    }

    const newRubro: Rubro = {
      idRubro: 0,
      nombre,
      idRubroPadre: selectedRubro.idRubroPadre,
    };
    handleRubroAdd(newRubro);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Rubro</Modal.Title>
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
              onChange={(event) => setRubroId(parseInt(event.target.value))}
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
            Agregar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddRubroIngredienteModal;
