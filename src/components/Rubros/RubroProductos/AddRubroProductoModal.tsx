import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AddRubroProductoModalProps } from '../../../interface/Producto';
import { Rubro } from '../../../interface/Rubro';

const AddRubroProductoModal: React.FC<AddRubroProductoModalProps> = ({
  show,
  handleClose,
  handleRubroAdd,
}) => {
  const [nombre, setNombre] = useState('');
  const [activo, setActivo] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!nombre || !nombre.trim()) {
      console.log('El nombre es obligatorio');
      return;
    }

    const newRubro: Rubro = {
      idRubro: 0, // Asigna el ID correspondiente, o déjalo en 0 si el backend se encargará de generarlo
      nombre: nombre.trim(),      
      activo,
    };
    handleRubroAdd(newRubro);
    handleClose();

    // Restablecer los valores del formulario
    setNombre('');
    setActivo(false);
  };

  const handleStatusChange = (isActivo: boolean) => {
    setActivo(isActivo);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar rubro de producto</Modal.Title>
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
            <Form.Label>Estado</Form.Label>
            <div>
              <Button
                variant={activo ? 'outline-primary' : 'primary'}
                className="mr-2"
                onClick={() => handleStatusChange(false)}
              >
                Activo
              </Button>
              <Button
                variant={activo ? 'primary' : 'outline-primary'}
                onClick={() => handleStatusChange(true)}
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
            Agregar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddRubroProductoModal;
