import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Producto } from "../../../interface/Producto";
import { Rubro } from "../../../interface/Rubro";
interface EditProductoModalProps {
  show: boolean;
  handleClose: () => void;
  handleProductoEdit: (producto: Producto) => void;
  selectedProducto: Producto | null;
}

const EditProductoModal: React.FC<EditProductoModalProps> = ({
  show,
  handleClose,
  handleProductoEdit,
  selectedProducto,
}) => {
  const [nombre, setNombre] = useState(selectedProducto?.nombre || "");
  const [rubroId, setRubroId] = useState<number | null>(selectedProducto?.Rubro?.idRubro || null);
  const [tiempo, setTiempo] = useState(selectedProducto?.tiempoEstimadoCocina || 0);
  const [rubros, setRubros] = useState<Rubro[]>([]);

  useEffect(() => {
    fetch("/assets/data/rubrosProductosEjemplo.json")
      .then((response) => response.json())
      .then((data: Rubro[]) => {
        setRubros(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setNombre(selectedProducto?.nombre || "");
    setRubroId(selectedProducto?.Rubro?.idRubro || null);
    setTiempo(selectedProducto?.tiempoEstimadoCocina || 0);
  }, [selectedProducto]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedProducto) {
      const selectedRubro = rubros.find((rubro) => rubro.idRubro === rubroId);
      const updatedProducto: Producto = {
        ...selectedProducto,
        nombre,
        tiempoEstimadoCocina: tiempo,
        Rubro: selectedRubro || { idRubro: 0, nombre: "" },
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
                setRubroId(parseInt(event.target.value));
              }}
              required
            >
              <option value="">Seleccione un rubro</option>
              {rubros.map((rubro) => (
                <option key={rubro.idRubro} value={rubro.idRubro}>
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
