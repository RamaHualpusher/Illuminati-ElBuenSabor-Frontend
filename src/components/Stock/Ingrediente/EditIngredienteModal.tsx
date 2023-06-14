import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Ingredientes } from '../../../interface/Ingredientes';
import { Rubro } from '../../../interface/Rubro';
import { UnidadMedida } from '../../../interface/UnidadMedida';

interface EditIngredientesModalProps {
  show: boolean;
  handleClose: () => void;
  handleIngredientesEdit: (Ingredientes: Ingredientes) => void;
  selectedIngredientes: Ingredientes | null;
}

const EditIngredientesModal: React.FC<EditIngredientesModalProps> = ({
  show,
  handleClose,
  handleIngredientesEdit,
  selectedIngredientes,
}) => {
  const [nombre, setNombre] = useState(selectedIngredientes?.nombre || '');
  const [rubro, setRubro] = useState(selectedIngredientes?.Rubro || '');
  const [minStock, setMinStock] = useState(selectedIngredientes?.stockMinimo || 0);
  const [stockActual, setStockActual] = useState(selectedIngredientes?.stockActual || 0);
  const [estado, setEstado] = useState(selectedIngredientes?.estado || false);
  const [um, setUM] = useState(selectedIngredientes?.UnidadMedida || '');
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [unidadMedida, setUnidadMedida] = useState<UnidadMedida[]>([]);
  const [rubroId, setRubroId] = useState<number | null>(null);
  const [idUM, setIdUM] = useState<number | null>(null);

  useEffect(() => {
    fetch('/assets/data/rubrosIngredientessEjemplo.json')
      .then(response => response.json())
      .then(data => {
        setRubros(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setNombre(selectedIngredientes?.nombre || '');
    setRubro(selectedIngredientes?.Rubro || '');
    setMinStock(selectedIngredientes?.stockMinimo || 0);
    setStockActual(selectedIngredientes?.stockActual || 0);
    setUM(selectedIngredientes?.UnidadMedida || '');
    setEstado(selectedIngredientes?.estado || false);
  }, [selectedIngredientes]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedIngredientes) {
      const selectedRubro = rubros.find(rubro => rubro.idRubro === rubroId);
      const selectedUnidaMedida=unidadMedida.find(unidad=> unidad.idUnidadMedida===idUM)
      const updatedIngredientes: Ingredientes = {
        idIngredientes: selectedIngredientes.idIngredientes,
        nombre:selectedIngredientes.nombre,
        Rubro: selectedRubro||{ idRubro: 0, nombre: "" },
        stockMinimo:selectedIngredientes.stockMinimo,
        stockActual:selectedIngredientes.stockActual,
        UnidadMedida:selectedUnidaMedida||{idUnidadMedida:0,denominacion:""},
        estado:selectedIngredientes.estado,
      };
      handleIngredientesEdit(updatedIngredientes);
    }
    handleClose();
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Ingredientes</Modal.Title>
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
          
          <Form.Group className="mb-3" controlId="formUM">
            <Form.Label>UM</Form.Label>
            <Form.Select
              value={idUM || ""}
              onChange={(event) => {
                setUM(event.target.value);
                setIdUM(parseInt(event.target.value));
              }}
              required
            >
              <option value="">Seleccione una Unida de Medida</option>
              {unidadMedida.map((um) => (
                <option key={um.idUnidadMedida} value={um.idUnidadMedida}>
                  {um.denominacion}
                </option>
              ))}
            </Form.Select>
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

export default EditIngredientesModal;
