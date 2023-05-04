import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Ingrediente } from "./IngredientesTable";

type AddIngredienteModalProps = {
  show: boolean;
  handleClose: () => void;
  handleIngredienteAdd: (ingrediente: Ingrediente) => void;
};

const AddIngredienteModal = ({
  show,
  handleClose,
  handleIngredienteAdd,
}: AddIngredienteModalProps) => {
  const [nombre, setNombre] = useState("");
  const [rubro, setRubro] = useState("");
  const [minStock, setMinStock] = useState(0);
  const [stockActual, setStockActual] = useState(0);
  const [precio, setPrecio] = useState(0);
  const [um, setUM] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newIngrediente: Ingrediente = {
      id: 0,
      nombre,
      rubro,
      minStock,
      stockActual,
      precio,
      um,
    };
    handleIngredienteAdd(newIngrediente);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Ingrediente</Modal.Title>
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
          <Form.Group className="mb-3" controlId="formMinStock">
            <Form.Label>Min Stock</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese stock mínimo"
              value={minStock}
              onChange={(event) => setMinStock(parseInt(event.target.value))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formStockActual">
            <Form.Label>Stock Actual</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese stock actual"
              value={stockActual}
              onChange={(event) => setStockActual(parseInt(event.target.value))}
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
          <Form.Group className="mb-3" controlId="formUM">
            <Form.Label>UM</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese unidad de medida"
              value={um}
              onChange={(event) => setUM(event.target.value)}
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

export default AddIngredienteModal;
