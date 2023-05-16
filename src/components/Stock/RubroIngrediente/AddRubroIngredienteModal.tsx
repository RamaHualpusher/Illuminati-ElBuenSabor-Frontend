import React, { FC, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { RubrosIngredientes } from '../../../interface/interfaces';

type AddRubroIngredienteModalProps = {
  show: boolean;
  handleClose: () => void;
  handleRubroIngredienteAdd: (rubroIngrediente: RubrosIngredientes) => void;
};

const AddRubroIngredienteModal: FC<AddRubroIngredienteModalProps> = ({
  show,
  handleClose,
  handleRubroIngredienteAdd,
}) => {
  const [rubroIngrediente, setRubroIngrediente] = useState<RubrosIngredientes>({
    id: 0,
    nombre: '',
    rubro: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRubroIngrediente({ ...rubroIngrediente, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (rubroIngrediente.nombre.length >= 3 && rubroIngrediente.rubro.length >= 3) {
      handleRubroIngredienteAdd(rubroIngrediente);
      setRubroIngrediente({
        id: 0,
        nombre: '',
        rubro: '',
      });
      handleClose();
    } else {
      alert('Los campos Nombre y Rubro deben tener al menos 3 caracteres.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Rubro Ingrediente</Modal.Title>
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

export default AddRubroIngredienteModal;
