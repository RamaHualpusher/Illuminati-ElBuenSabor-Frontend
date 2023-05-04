import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Ingrediente } from "./IngredientesTable";

type EditIngredienteModalProps = {
  show: boolean;
  handleClose: () => void;
  handleIngredienteEdit: (ingrediente: Ingrediente) => void;
  selectedIngrediente: Ingrediente | null;
};

const EditIngredienteModal = ({
  show,
  handleClose,
  handleIngredienteEdit,
  selectedIngrediente,
}: EditIngredienteModalProps) => {
  const [nombre, setNombre] = useState(selectedIngrediente?.nombre || "");
  const [rubro, setRubro] = useState(selectedIngrediente?.rubro || "");
  const [minStock, setMinStock] = useState(selectedIngrediente?.minStock || 0);
  const [stockActual, setStockActual] = useState(
    selectedIngrediente?.stockActual || 0
  );
  const [precio, setPrecio] = useState(selectedIngrediente?.precio || 0);
  const [um, setUM] = useState(selectedIngrediente?.um || "");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedIngrediente) {
      const updatedIngrediente: Ingrediente = {
        id: selectedIngrediente.id,
        nombre,
        rubro,
        minStock,
        stockActual,
        precio,
        um,
      };
      handleIngredienteEdit(updatedIngrediente);
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Ingrediente</Modal.Title>
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
              placeholder="Ingrese unidadde medida"
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
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditIngredienteModal;
