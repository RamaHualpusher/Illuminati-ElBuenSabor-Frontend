import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { IRubroNew } from "../../../../interface/IRubro";

interface IEditRubroProductoModalProps {
  show: boolean;
  handleClose: () => void;
  handleRubroEdit: (rubro: IRubroNew) => void;
  selectedRubro: IRubroNew | null;
  categorias: IRubroNew[];
}

const EditRubroProductoModal: React.FC<IEditRubroProductoModalProps> = ({
  show,
  handleClose,
  handleRubroEdit,
  selectedRubro,
  categorias,
}) => {
  // Estados del componente
  const [nombre, setNombre] = useState("");
  const [activo, setActivo] = useState(false);
  const [ingredientOwner, setIngredientOwner] = useState(false);
  const [rubroPadreId, setRubroPadreId] = useState<number | undefined>(0);

  // Actualizar estados cuando se selecciona un rubro
  useEffect(() => {
    if (selectedRubro) {
      setNombre(selectedRubro.nombre);
      setActivo(selectedRubro.activo || false);
      setIngredientOwner(selectedRubro.ingredientOwner || false);
      setRubroPadreId(
        selectedRubro.rubroPadre ? selectedRubro.rubroPadre.id : 0
      );
    }
  }, [selectedRubro]);

  // Función para manejar el envío del formulario
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNombre = nombre.trim();
    if (!trimmedNombre || /^\d+$/.test(trimmedNombre)) {
      alert(
        "El nombre no puede estar vacío, contener solo números o ser nulo."
      );
      return;
    }

    const rubroPadre = categorias.find((rubro) => rubro.id === rubroPadreId);

    if (selectedRubro) {
      const updatedRubro: IRubroNew = {
        ...selectedRubro,
        id: selectedRubro.id || 0,
        nombre,
        activo,
        rubroPadre,
        ingredientOwner,
      };
      handleRubroEdit(updatedRubro);
    }
    handleClose();
  };

  // Función para cambiar el estado
  const handleStatusChange = (isActive: boolean) => {
    setActivo(isActive);
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Editar rubro de producto</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="nombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese nombre"
                  name="nombre"
                  value={nombre}
                  onChange={(event) => setNombre(event.target.value)}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formEstado">
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
            </Col>
          </Row>

          <Form.Group className="mb-3" controlId="formIngredientOwner">
            <Form.Label>Rubro corresponde a</Form.Label>
            <Form.Check
              type="radio"
              label="Producto"
              checked={!ingredientOwner}
              onChange={() => setIngredientOwner(false)}
            />
            <Form.Check
              type="radio"
              label="Ingrediente"
              checked={ingredientOwner}
              onChange={() => setIngredientOwner(true)}
            />
          </Form.Group>
          {!ingredientOwner && (
            <Form.Group className="mb-3" controlId="formRubroPadre">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={rubroPadreId}
                onChange={(event) =>
                  setRubroPadreId(parseInt(event.target.value))
                }
              >
                <option value={0}>Seleccionar</option>
                {categorias.map((rubro) => (
                  <option key={rubro.id} value={rubro.id}>
                    {rubro.nombre}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
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

export default EditRubroProductoModal;
