import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import axios from "axios";
import {
  IIngredientes,
  IEditCompraIngredientesModalProps,
} from "../../../interface/IIngredientes";

const EditCompraIngredientesModal: React.FC<
  IEditCompraIngredientesModalProps
> = ({ show, handleClose, handleIngredientesEdit }) => {
  // Estados locales para almacenar los datos del formulario y los ingredientes
  const [ingredientes, setIngredientes] = useState<IIngredientes[]>([]);
  const [nombre, setNombre] = useState("");
  const [precioCosto, setPrecioCosto] = useState(0);
  const [activo, setActivo] = useState(true);
  const [cantidad, setCantidad] = useState(0);
  const [selectedIngrediente, setSelectedIngrediente] =
    useState<IIngredientes | null>(null);
  const [unidadMedida, setUnidadMedida] = useState("");
  const [error, setError] = useState("");
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // URL para la carga de datos iniciales
  const API_URL = process.env.REACT_APP_API_URL || "";

  // Efecto para cargar datos iniciales de ingredientes
  useEffect(() => {
    axios
      .get(API_URL + "ingrediente")
      .then((response) => {
        const filteredIngredientes: IIngredientes[] = response.data;
        setIngredientes(filteredIngredientes);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Efecto para actualizar campos al seleccionar un ingrediente
  useEffect(() => {
    if (selectedIngrediente) {
      setNombre(selectedIngrediente.nombre ?? "");
      setPrecioCosto(selectedIngrediente.precioCosto ?? 0);
      setActivo(selectedIngrediente.activo ?? false);
      setCantidad(0);
      setUnidadMedida(selectedIngrediente.unidadMedida ?? "");
      setSelectedIngrediente(selectedIngrediente);
      console.log("useEffect aca");
    }
  }, [selectedIngrediente]);

  // Manejar cambio de ingrediente seleccionado
  const handleIngredienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIngredienteId = parseInt(e.target.value);
    const selectedIngrediente = ingredientes.find(
      (ingrediente) => ingrediente.id === selectedIngredienteId
    );
    if (selectedIngrediente) {
      console.log("entro al if change");
      setNombre(selectedIngrediente.nombre ?? "");
      setPrecioCosto(selectedIngrediente.precioCosto ?? 0);
      setActivo(selectedIngrediente.activo ?? true);
      setUnidadMedida(selectedIngrediente.unidadMedida ?? "");
      setSelectedIngrediente(selectedIngrediente);
      console.log("saliendo del if change");
    }
  };

  const handleCancelar = () => {
    setNombre("");
    setPrecioCosto(0);
    setActivo(true);
    setCantidad(0);
    setSelectedIngrediente(null);
    setUnidadMedida("");
    setError("");
    setSubmitAttempted(false);
    handleClose();
  };

  // Manejar envío del formulario
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitAttempted(true);
    if (cantidad <= 0) {
      setError("La cantidad debe ser mayor que cero.");
      return;
    }
    if (selectedIngrediente) {
      console.log("entro al if de handleSubmit aca");
      const editedIngredientes: IIngredientes = {
        ...selectedIngrediente,
        nombre,
        precioCosto,
        activo,
        stockActual: selectedIngrediente.stockActual,
      };
      handleIngredientesEdit(editedIngredientes, cantidad);
      handleCancelar();
      handleClose(); // Cerrar el modal
    }
  };

  // Renderizar el modal y el formulario
  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Compra de Ingredientes</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Form.Group controlId="formIngrediente" as={Col} sm={6}>
              <Form.Label>Seleccionar Ingrediente</Form.Label>
              <Form.Select
                value={selectedIngrediente?.id ?? ""}
                onChange={handleIngredienteChange}
                required
              >
                <option value="">Seleccione un ingrediente</option>
                {ingredientes.map((ingrediente) => (
                  <option key={ingrediente.id} value={ingrediente.id}>
                    {ingrediente.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group as={Col} sm={6} controlId="formUM">
              <Form.Label>Unidad de Medida</Form.Label>
              <Form.Control plaintext readOnly value={unidadMedida} />
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} sm={6} controlId="formPrecioCosto">
              <Form.Label>Precio de Costo</Form.Label>
              <Form.Control
                type="number"
                value={precioCosto}
                onChange={(e) => setPrecioCosto(parseInt(e.target.value))}
                min={1}
                required
              />
            </Form.Group>
            <Form.Group as={Col} sm={6} className="mb-3" controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={activo ? "alta" : "baja"}
                onChange={(event) => setActivo(event.target.value === "alta")}
                required
              >
                <option value="alta">Alta</option>
                <option value="baja">Baja</option>
              </Form.Select>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group as={Col} sm={6} controlId="formCantidad">
              <Form.Label>Cantidad</Form.Label>
              <Form.Control
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(parseInt(e.target.value))}
                required
                isInvalid={submitAttempted && cantidad <= 0}
                min={1}
              />
              <Form.Control.Feedback type="invalid">
                La cantidad debe ser mayor que cero.
              </Form.Control.Feedback>
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelar}>
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

export default EditCompraIngredientesModal;
