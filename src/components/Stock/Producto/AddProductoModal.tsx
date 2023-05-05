import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Producto } from "./ProductosTable";
import axios from "axios";

type AddProductoModalProps = {
  show: boolean;
  handleClose: () => void;
  handleProductoAdd: (producto: Producto) => void;
};

type Rubro = {
  id: number;
  nombre: string;
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
            <Form.Select
              onChange={(event) => setRubroId(parseInt(event.target.value))}
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
