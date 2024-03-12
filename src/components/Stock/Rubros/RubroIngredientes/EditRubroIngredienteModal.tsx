import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { IRubroNew } from '../../../../interface/IRubro';
import { IEditRubroIngredientesModalProps } from '../../../../interface/IIngredientes';

const EditRubroIngredientesModal: React.FC<IEditRubroIngredientesModalProps> = ({
  show,
  handleClose,
  handleRubroEdit,
  selectedRubro,
}) => {
  // Estados del componente
  const [nombre, setNombre] = useState('');
  const [activo, setActivo] = useState(false);
  const [rubroPadre, setRubroPadre] = useState<IRubroNew | undefined>(undefined);

  // Cargar los valores del rubro seleccionado al montar el componente
  useEffect(() => {
    if (selectedRubro) {
      setNombre(selectedRubro.nombre);
      setActivo(selectedRubro.ingredientOwner || false);
      setRubroPadre(selectedRubro.rubroPadre);
    }
  }, [selectedRubro]);

  // Manejar el envío del formulario
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNombre = nombre.trim();
    if (!trimmedNombre || /^\d+$/.test(trimmedNombre)) {
      alert('El nombre no puede estar vacío, contener solo números o ser nulo.');
      return;
    }

    if (selectedRubro) {
      const updatedRubro: IRubroNew = {
        ...selectedRubro,
        nombre,
        ingredientOwner: activo,
        rubroPadre,
      };
      handleRubroEdit(updatedRubro);
    }
    handleClose();
  };

  // Cambiar el estado del rubro
  const handleStatusChange = (isActive: boolean) => {
    setActivo(isActive);
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
          <Form.Group className="mb-3" controlId="formEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              value={activo ? 'alta' : 'baja'}
              onChange={(event) =>
                setActivo(event.target.value === 'alta')
              }
              required
            >
              <option value="alta">Alta</option>
              <option value="baja">Baja</option>
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
