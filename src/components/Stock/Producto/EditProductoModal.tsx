import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ProductoManufacturado } from "../../../interface/ProductoManufacturado";
import { Rubro } from "../../../interface/Rubro";

interface EditProductoModalProps {
  show: boolean;
  handleClose: () => void;
  handleProductoEdit: (producto: ProductoManufacturado) => void;
  selectedProducto: ProductoManufacturado | null;
}

const EditProductoModal = ({
  show,
  handleClose,
  handleProductoEdit,
  selectedProducto,
}: EditProductoModalProps) => {
  const [nombre, setNombre] = useState(selectedProducto?.nombre || "");
  const [rubro, setRubro] = useState(selectedProducto?.Rubro?.nombre || "");
  const [tiempo, setTiempo] = useState(selectedProducto?.tiempoEstimadoCocina || 0);
  //const [precio, setPrecio] = useState(selectedProducto?.precio || 0); //Implementar precio
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [rubroId, setRubroId] = useState<number | null>(null);

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
    setRubro(selectedProducto?.Rubro?.nombre || "");
    setTiempo(selectedProducto?.tiempoEstimadoCocina || 0);
    //setPrecio(selectedProducto?.precio || 0); //Implementar precio
  }, [selectedProducto]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedProducto) {
      const selectedRubro = rubros.find((rubro) => rubro.idRubro === rubroId);
      const updatedProducto: ProductoManufacturado = {
        idProductoManufacturado: selectedProducto.idProductoManufacturado,
        nombre,
        tiempoEstimadoCocina: tiempo,
        denominacion: selectedProducto.denominacion,
        imagen: selectedProducto.imagen,
        stockActual: selectedProducto.stockActual,
        stockMinimo: selectedProducto.stockMinimo,
        preparacion: selectedProducto.preparacion,
        Ingrediente: selectedProducto.Ingrediente,
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
                setRubro(event.target.value);
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
          {/* <Form.Group className="mb-3" controlId="formPrecio">
            <Form.Label>Precio</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese precio"
              value={precio}
              onChange={(event) => setPrecio(parseFloat(event.target.value))}
              required
            />
          </Form.Group> */}
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
