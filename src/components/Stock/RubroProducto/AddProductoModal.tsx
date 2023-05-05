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
    rubro: '',
  });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (producto.nombre.length >= 3 && producto.rubro.length >= 3) {
      handleProductoAdd(producto);
      setProducto({
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
          <Form.Group controlId="formBasicRubro">
            <Form.Label>Rubro</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese rubro"
              name="rubro"
              value={producto.rubro}
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

export default AddProductoModal;
