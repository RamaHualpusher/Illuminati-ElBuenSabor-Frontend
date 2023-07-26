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
  const [nombre, setNombre] = useState('');
  const [activo, setActivo] = useState(false);
  const [idRubroPadre, setIdRubroPadre] = useState<Rubro | undefined>(undefined);

  useEffect(() => {
    if (selectedRubro) {
      setNombre(selectedRubro.nombre);
      setActivo(selectedRubro.activo || false);
      setIdRubroPadre(selectedRubro.idRubroPadre);
    }
  }, [selectedRubro]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNombre = nombre.trim();
    if (!trimmedNombre || /^\d+$/.test(trimmedNombre)) {
      alert('El nombre no puede estar vacío, contener solo números o ser nulo.');
      return;
    }

    if (selectedRubro) {
      const updatedRubro: Rubro = {
        ...selectedRubro,
      idRubro: selectedRubro.idRubro || 0,
      nombre,
      activo,
      idRubroPadre,
      };
      handleRubroEdit(updatedRubro);
    }
    handleClose();
  };

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
          <Form.Group className="mb-3" controlId="formActivo">
            <Form.Label>Estado</Form.Label>
            <div>
            <Button
                variant={activo ? 'primary' : 'outline-primary'}
                className={activo ? 'mr-2 active' : 'mr-2'}
                onClick={() => handleStatusChange(true)}
              >
                Activo
              </Button>
              <Button
                variant={!activo ? 'primary' : 'outline-primary'}
                className={!activo ? 'active' : ''}
                onClick={() => handleStatusChange(false)}
              >
                Inactivo
              </Button>
            </div>
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
