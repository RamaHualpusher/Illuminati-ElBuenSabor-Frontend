import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Ingrediente } from "./IngredientesTable";
import axios from "axios";

type EditIngredienteModalProps = {
  show: boolean;
  handleClose: () => void;
  handleIngredienteEdit: (ingrediente: Ingrediente) => void;
  selectedIngrediente: Ingrediente | null;
};

type Rubro = {
  id: number;
  nombre: string;
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
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [rubroId, setRubroId] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get<Rubro[]>("/assets/data/rubrosIngredientesEjemplo.json")
      .then((response) => {
        setRubros(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setNombre(selectedIngrediente?.nombre || "");
    setRubro(selectedIngrediente?.rubro || "");
    setMinStock(selectedIngrediente?.minStock || 0);
    setStockActual(selectedIngrediente?.stockActual || 0);
    setPrecio(selectedIngrediente?.precio || 0);
    setUM(selectedIngrediente?.um || "");
  }, [selectedIngrediente]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedIngrediente) {
      const selectedRubro = rubros.find((rubro) => rubro.id === rubroId);
      const updatedIngrediente: Ingrediente = {
        id: selectedIngrediente.id,
        nombre,
        rubro: selectedRubro?.nombre || "",
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
            <Form.Select
              value={rubroId || ""}
              onChange={(event) => {
                setRubro(event.target.value);
                setRubroId(parseInt(event.target.value));
              }}
              required
            >
              <option value="">Seleccione un rubro</option>
              {rubros.map((rubro) => (
                <option key={rubro.id} value={rubro.id}>
                  {rubro.nombre}
                </option>
              ))}
            </Form.Select>
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
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditIngredienteModal;
