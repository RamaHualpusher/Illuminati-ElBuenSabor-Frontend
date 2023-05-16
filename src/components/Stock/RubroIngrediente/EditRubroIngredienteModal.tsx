import React, { FC, useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { RubrosIngredientes } from '../../../interface/interfaces';

type EditRubroIngredienteModalProps = {
  show: boolean;
  handleClose: () => void;
  handleRubroIngredienteEdit: (rubroIngrediente: RubrosIngredientes) => void;
  selectedRubroIngrediente: RubrosIngredientes | null;
};

const EditRubroIngredienteModal: FC<EditRubroIngredienteModalProps> = ({
  show,
  handleClose,
  handleRubroIngredienteEdit,
  selectedRubroIngrediente,
}) => {
  const [rubroIngrediente, setRubroIngrediente] = useState<RubrosIngredientes>({
    id: 0,
    nombre: '',
    rubro: '',
  });

  useEffect(() => {
    if (selectedRubroIngrediente) {
      setRubroIngrediente(selectedRubroIngrediente);
    }
  }, [selectedRubroIngrediente]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRubroIngrediente({ ...rubroIngrediente, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleRubroIngredienteEdit(rubroIngrediente);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Rubro Ingrediente</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese nombre"
              name="nombre"
              value={rubroIngrediente.nombre}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicRubro">
            <Form.Label>Rubro</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese rubro"
              name="rubro"
              value={rubroIngrediente.rubro}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Button variant="secondary" onClick={handleClose} style={{ marginTop: '10px' }}>
            Cancelar
          </Button>{' '}
          <Button variant="primary" type="submit" style={{ marginTop: '10px' }}>
            Guardar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditRubroIngredienteModal;
