import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Producto } from "./ProductosTable";

type AddProductoModalProps = {
  show: boolean;
  handleClose: () => void;
  handleProductoAdd: (producto: Producto) => void;
};

const AddProductoModal = ({
  show,
  handleClose,
  handleProductoAdd,
}: AddProductoModalProps) => {
  const [nombre, setNombre] = useState("");
  const [rubro, setRubro] = useState("");
  const [tiempo, setTiempo] = useState(0);
  const [precio, setPrecio] = useState(0);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newProducto: Producto = {
      id: 0,
      nombre,
      rubro,
      tiempo,
      precio,
    };
    handleProductoAdd(newProducto);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Producto</Modal.Title>
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
            <Form.Control
              type="text"
              placeholder="Ingrese rubro"
              value={rubro}
              onChange={(event) => setRubro(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTiempo">
            <Form.Label>Tiempo</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese tiempo"
              value={tiempo}
              onChange={(event) => setTiempo(parseInt(event.target.value))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formPrecio">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese precio"
              value={precio}
              onChange={(event) => setPrecio(parseFloat(event.target.value))}
              required
            />
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

export default AddProductoModal;
