import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Producto } from "./ProductosTable";
import axios from "axios";

type EditProductoModalProps = {
  show: boolean;
  handleClose: () => void;
  handleProductoEdit: (producto: Producto) => void;
  selectedProducto: Producto | null;
};

type Rubro = {
  id: number;
  nombre: string;
};

const EditProductoModal = ({
  show,
  handleClose,
  handleProductoEdit,
  selectedProducto,
}: EditProductoModalProps) => {
  const [nombre, setNombre] = useState(selectedProducto?.nombre || "");
  const [rubro, setRubro] = useState(selectedProducto?.rubro || "");
  const [tiempo, setTiempo] = useState(selectedProducto?.tiempo || 0);
  const [precio, setPrecio] = useState(selectedProducto?.precio || 0);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [rubroId, setRubroId] = useState<number | null>(null);

  useEffect(() => {
    axios
      .get<Rubro[]>("/assets/data/rubrosProductosEjemplo.json")
      .then((response) => {
        setRubros(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setNombre(selectedProducto?.nombre || "");
    setRubro(selectedProducto?.rubro || "");
    setTiempo(selectedProducto?.tiempo || 0);
    setPrecio(selectedProducto?.precio || 0);
  }, [selectedProducto]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedProducto) {
      const selectedRubro = rubros.find((rubro) => rubro.id === rubroId);
      const updatedProducto: Producto = {
        id: selectedProducto.id,
        nombre,
        rubro: selectedRubro?.nombre || "",
        tiempo,
        precio,
      };
      handleProductoEdit(updatedProducto);
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Producto</Modal.Title>
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
      <Form.Group className="mb-3" controlId="formTiempo">
        <Form.Label>Tiempo (min)</Form.Label>
        <Form.Control
          type="number"
          placeholder="Ingrese tiempo en minutos"
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
        Guardar Cambios
      </Button>
    </Modal.Footer>
  </Form>
</Modal>
);
};

export default EditProductoModal;