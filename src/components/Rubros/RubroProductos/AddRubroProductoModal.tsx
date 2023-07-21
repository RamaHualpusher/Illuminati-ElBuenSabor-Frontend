import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AddRubroProductoModalProps } from '../../../interface/Producto';
import { Rubro } from '../../../interface/Rubro';

const AddRubroProductoModal: React.FC<AddRubroProductoModalProps> = ({
  show,
  handleClose,
  handleRubroAdd,
}) => {  
  const [activo, setActivo] = useState(false);
  const [rubroData, setRubroData] = useState<Rubro>({
    idRubro: 0,
    nombre: '',
    idRubroPadre: undefined,
  });
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    handleRubroAdd(rubroData);
    handleClose();
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRubroData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
              name="nombre"
              value={rubroData.nombre}
              onChange={handleInputChange}
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
