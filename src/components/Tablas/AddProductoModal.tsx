import React, { FC, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Producto } from './RubroProducto';

type AddProductoModalProps = {
  show: boolean;
  handleClose: () => void;
  handleProductoAdd: (producto: Producto) => void;
};

const AddProductoModal: FC<AddProductoModalProps> = ({
  show,
  handleClose,
  handleProductoAdd,
}) => {
  const [producto, setProducto] = useState<Producto>({
    id: 0,
    nombre: '',
    activo: false,
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleActivoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProducto({ ...producto, activo: event.target.checked });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (producto.nombre.length >= 3) {
      handleProductoAdd(producto);
      setProducto({
        id: 0,
        nombre: '',
        activo: false,
      });
      handleClose();
    } else {
      alert('El campo Nombre debe tener al menos 3 caracteres.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Producto</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese nombre"
              name="nombre"
              value={producto.nombre}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formBasicActivo">
            <Form.Check
              type="checkbox"
              label="Activo"
              name="activo"
              checked={producto.activo}
              onChange={handleActivoChange}
            />
          </Form.Group>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>{' '}
          <Button variant="primary" type="submit">
            Guardar
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProductoModal;
