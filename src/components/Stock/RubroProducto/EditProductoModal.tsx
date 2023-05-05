import React, { FC, useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Producto } from './RubroProducto';

type EditProductoModalProps = {
  show: boolean;
  handleClose: () => void;
  handleProductoEdit: (producto: Producto) => void;
  selectedProducto: Producto | null;
};

const EditProductoModal: FC<EditProductoModalProps> = ({
  show,
  handleClose,
  handleProductoEdit,
  selectedProducto,
}) => {
  const [producto, setProducto] = useState<Producto>({
    id: 0,
    nombre: '',
    rubro: '',
  });

  useEffect(() => {
    if (selectedProducto) {
      setProducto(selectedProducto);
    }
  }, [selectedProducto]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProducto({ ...producto, [name]: value });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleProductoEdit(producto);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
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

export default EditProductoModal;
