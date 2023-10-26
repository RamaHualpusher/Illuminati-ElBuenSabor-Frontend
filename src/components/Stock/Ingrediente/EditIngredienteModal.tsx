import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { Ingredientes } from '../../../interface/Ingredientes';
import { Rubro } from '../../../interface/Rubro';
import { EditIngredientesModalProps } from '../../../interface/Ingredientes';

const EditIngredientesModal: React.FC<EditIngredientesModalProps> = ({
  show,
  handleClose,
  handleIngredientesEdit,
  selectedIngredientes,
}) => {
  // Función para inicializar los atributos de la interfaz
  const initializeIngredientes = (): Ingredientes => ({
    idIngredientes: 0,
    nombre: '',
    estado: false,
    stockMinimo: 0,
    stockActual: 0,
    precioCosto: 0,
    unidadMedida: "Kg",
    Rubro: { idRubro: 0, nombre: '' },
  });

  const [ingredientes, setIngredientes] = useState<Ingredientes>(initializeIngredientes);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const unidades = ["Kg", "g", "Mg", "l", "Ml"];

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
    if (selectedIngredientes) {
      setIngredientes({
        idIngredientes: selectedIngredientes.idIngredientes,
        nombre: selectedIngredientes.nombre || '',
        estado: selectedIngredientes.estado || false,
        stockMinimo: selectedIngredientes.stockMinimo || 0,
        stockActual: selectedIngredientes.stockActual || 0,
        precioCosto: selectedIngredientes.precioCosto || 0,
        unidadMedida: selectedIngredientes.unidadMedida || "Kg",
        Rubro: selectedIngredientes.Rubro || { idRubro: 0, nombre: '' },
      });
    }
  }, [selectedIngredientes]);

  // Manejar el envío del formulario de edición
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedIngredientes) {
      const selectedRubro = rubros.find((rubro) => rubro.idRubro === ingredientes.Rubro.idRubro);

      // Crear un nuevo objeto Ingredientes con los datos editados
      const updatedIngredientes: Ingredientes = {
        ...ingredientes,
        Rubro: selectedRubro || { idRubro: 0, nombre: '' },
      };
      handleIngredientesEdit(updatedIngredientes);
    }
    handleClose();
  };

  // Función para manejar la conversión de unidades de medida
  const handleUM = (unidad: string) => {
    setIngredientes({ ...ingredientes, unidadMedida: unidad });

    const selectedUnidad = unidades.find((u) => u === unidad);
    const currentUnidad = unidades.find((u) => u === ingredientes.unidadMedida);

    if (selectedUnidad && currentUnidad) {
      const selectedFactor = unidades.indexOf(selectedUnidad);
      const currentFactor = unidades.indexOf(currentUnidad);
      const conversionFactor = 10 ** (selectedFactor - currentFactor);

      setIngredientes({
        ...ingredientes,
        stockActual: ingredientes.stockActual * conversionFactor,
        stockMinimo: ingredientes.stockMinimo * conversionFactor,
      });
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Ingredientes</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Formulario para editar los datos del ingrediente */}
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese nombre"
                  value={ingredientes.nombre}
                  onChange={(event) => setIngredientes({ ...ingredientes, nombre: event.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formRubro">
                <Form.Label>Rubro</Form.Label>
                <Form.Select
                  value={ingredientes.Rubro.idRubro || ''}
                  onChange={(event) => {
                    setIngredientes({ ...ingredientes, Rubro: { idRubro: parseInt(event.target.value), nombre: '' } });
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
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formMinStock">
                <Form.Label>Min Stock</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingrese stock mínimo"
                  value={ingredientes.stockMinimo}
                  onChange={(event) => setIngredientes({ ...ingredientes, stockMinimo: parseInt(event.target.value) })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formStockActual">
                <Form.Label>Stock Actual</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingrese stock actual"
                  value={ingredientes.stockActual}
                  onChange={(event) => setIngredientes({ ...ingredientes, stockActual: parseInt(event.target.value) })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formPrecioCosto">
                <Form.Label>PrecioCosto</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingrese precio Costo"
                  value={ingredientes.precioCosto}
                  onChange={(event) => setIngredientes({ ...ingredientes, precioCosto: parseInt(event.target.value) })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formUM">
                <Form.Label>UM</Form.Label>
                <Form.Select
                  value={ingredientes.unidadMedida}
                  onChange={(event) => handleUM(event.target.value)}
                  required
                >
                  {unidades.map((unidad) => (
                    <option value={unidad}>{unidad}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3" controlId="formEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              value={ingredientes.estado ? 'alta' : 'baja'}
              onChange={(event) => setIngredientes({ ...ingredientes, estado: event.target.value === 'alta' })}
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
