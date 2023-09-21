import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Ingredientes } from '../../../interface/Ingredientes';
import { Rubro } from '../../../interface/Rubro';
import { EditIngredientesModalProps } from '../../../interface/Ingredientes';

const EditIngredientesModal: React.FC<EditIngredientesModalProps> = ({
  show,
  handleClose,
  handleIngredientesEdit,
  selectedIngredientes,
}) => {
  // Estados para los campos del formulario con valores iniciales de los ingredientes seleccionados
  const [nombre, setNombre] = useState(selectedIngredientes?.nombre || '');
  const [rubroId, setRubroId] = useState<number | null>(selectedIngredientes?.Rubro.idRubro || null);
  const [minStock, setMinStock] = useState(selectedIngredientes?.stockMinimo || 0);
  const [stockActual, setStockActual] = useState(selectedIngredientes?.stockActual || 0);
  const [precioCosto, setPrecioCosto] = useState(selectedIngredientes?.precioCosto || 0);
  const [estado, setEstado] = useState(selectedIngredientes?.estado || false);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const [um, setUm] = useState(selectedIngredientes?.unidadMedida || "Kg");

  // Unidades de medida disponibles con sus factores de conversión
  const unidades = [["Kg", 2], ["g", 1], ["Mg", 0], ["l", 1], ["Ml", 0]];

  // Cargar los rubros al cargar el componente
  useEffect(() => {
    fetch('/assets/data/rubrosIngredientesEjemplo.json')
      .then(response => response.json())
      .then(data => {
        setRubros(data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  // Actualizar los campos del formulario al cambiar el ingrediente seleccionado
  useEffect(() => {
    setNombre(selectedIngredientes?.nombre || '');
    setRubroId(selectedIngredientes?.Rubro.idRubro || null);
    setMinStock(selectedIngredientes?.stockMinimo || 0);
    setStockActual(selectedIngredientes?.stockActual || 0);
    setEstado(selectedIngredientes?.estado || false);
    setPrecioCosto(selectedIngredientes?.precioCosto || 0);
    setUm(selectedIngredientes?.unidadMedida || "Kg");
  }, [selectedIngredientes]);

  // Manejar el envío del formulario de edición
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedIngredientes) {
      const selectedRubro = rubros.find((rubro) => rubro.idRubro === rubroId);

      // Crear un nuevo objeto Ingredientes con los datos editados
      const updatedIngredientes: Ingredientes = {
        idIngredientes: selectedIngredientes.idIngredientes,
        nombre,
        Rubro: selectedRubro || { idRubro: 0, nombre: '' },
        stockMinimo: minStock,
        stockActual: stockActual,
        precioCosto,
        estado,
        unidadMedida: um
      };
      handleIngredientesEdit(updatedIngredientes);
    }
    handleClose();
  };

  // Función para manejar la conversión de unidades de medida
  const handleUM = (unidad: string) => {
    setUm(unidad);
    let mult = 2;
    let limit = 2;
    unidades.forEach((un) => {
      if (um === un[0]) {
        mult = +un[1];
      } else if (unidad === un[0]) {
        limit = +un[1];
      }
    });
    let stockA = stockActual;
    let stockM = minStock;
    while (mult < limit) {
      stockA = stockA / 10;
      stockM = stockM / 10;
      mult += 1;
    }
    while (mult > limit) {
      stockA = stockA * 10;
      stockM = stockM * 10;
      mult -= 1;
    }
    setStockActual(stockA);
    setMinStock(stockM);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Ingredientes</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Formulario para editar los datos del ingrediente */}
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
              value={rubroId || ''}
              onChange={(event) => {
                setRubroId(parseInt(event.target.value));
              }}
              required
            >
              <option value="">Seleccione un rubro</option>
              {rubros.map((rubro) => (
                <option
                  key={rubro.idRubro}
                  value={rubro.idRubro}
                  disabled={!rubro.estado}>
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
          <Form.Group className="mb-3" controlId="formPrecioCosto">
            <Form.Label>PrecioCosto</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese precio Costo"
              value={precioCosto}
              onChange={(event) => setPrecioCosto(parseInt(event.target.value))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formUM">
            <Form.Label>UM</Form.Label>
            <Form.Select
              value={um}
              onChange={(event) => handleUM(event.target.value)}
              required
            >
              {unidades.map((unidades) =>
                <option value={unidades[0]}>{unidades[0]}</option>
              )}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              value={estado ? 'alta' : 'baja'}
              onChange={(event) => setEstado(event.target.value === 'alta')}
              required
            >
              <option value="alta">Alta</option>
              <option value="baja">Baja</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          {/* Botones para cancelar y guardar cambios */}
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
