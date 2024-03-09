import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { IIngredientes } from '../../../interface/IIngredientes';
import { IRubro } from '../../../interface/IRubro';
import { IEditIngredientesModalProps } from '../../../interface/IIngredientes';
import axios from 'axios';

const EditIngredientesModal: React.FC<IEditIngredientesModalProps> = ({
  show,
  handleClose,
  handleIngredientesEdit,
  selectedIngredientes,
}) => {
  // Función para inicializar los atributos de la interfaz
  const initializeIngredientes = (): IIngredientes => ({
    id: 0,
    nombre: '',
    activo: false,
    stockMinimo: 0,
    stockActual: 0,
    precioCosto: 0,
    unidadMedida: "Kg",
    rubro: { id: 0, nombre: '' },
  });

  const [ingrediente, setIngrediente] = useState<IIngredientes>(initializeIngredientes);
  const [rubros, setRubros] = useState<IRubro[]>([]);
  const unidades = ["Kg", "g", "Mg", "l", "Ml"];
  const API_URL = process.env.REACT_APP_API_URL || "";

  // Cargar los rubros al cargar el componente
  useEffect(() => {
    const fetchRubros=async()=>{
      let URL=API_URL + "rubro";
      try{
        const response= await axios.get(URL);
        setRubros(response.data);
      }catch(error){
        console.error("Error al cargar rubros "+ error);
      }
    }
    fetchRubros();
  }, []);

  // Actualizar los campos del formulario al cambiar el ingrediente seleccionado
  useEffect(() => {
    if (selectedIngredientes) {
      setIngrediente({
        ...selectedIngredientes,
      });
    }
  }, [selectedIngredientes]);

  // Manejar el envío del formulario de edición
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedIngredientes) {
      const selectedRubro = rubros.find((rubro) => rubro.id === ingrediente.rubro.id);

      // Crear un nuevo objeto Ingredientes con los datos editados
      const updatedIngredientes: IIngredientes = {
        ...ingrediente,
        rubro: selectedRubro || { id: 0, nombre: '' },
      };
      handleIngredientesEdit(updatedIngredientes);
    }
    handleClose();
  };

  // Función para manejar la conversión de unidades de medida
  const handleUM = (unidad: string) => {
    setIngrediente({ ...ingrediente, unidadMedida: unidad });

    const selectedUnidad = unidades.find((u) => u === unidad);
    const currentUnidad = unidades.find((u) => u === ingrediente.unidadMedida);

    if (selectedUnidad && currentUnidad) {
      const selectedFactor = unidades.indexOf(selectedUnidad);
      const currentFactor = unidades.indexOf(currentUnidad);
      const conversionFactor = 10 ** (selectedFactor - currentFactor);

      setIngrediente({
        ...ingrediente,
        stockActual: ingrediente.stockActual * conversionFactor,
        stockMinimo: ingrediente.stockMinimo * conversionFactor,
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
                  value={ingrediente.nombre}
                  onChange={(event) => setIngrediente({ ...ingrediente, nombre: event.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formRubro">
                <Form.Label>Rubro</Form.Label>
                <Form.Select
                  value={ingrediente.rubro.id}
                  onChange={(event) => {
                    setIngrediente({ ...ingrediente, rubro: { id: parseInt(event.target.value), nombre: '' } });
                  }}
                  required
                >
                  <option value="">Seleccione un rubro</option>
                  {rubros.map((rubro) => (
                    <option
                      key={rubro.id}
                      value={rubro.id}
                      //disabled={!rubro.activo}
                      >
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
                  value={ingrediente.stockMinimo}
                  onChange={(event) => setIngrediente({ ...ingrediente, stockMinimo: parseInt(event.target.value) })}
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
                  value={ingrediente.stockActual}
                  onChange={(event) => setIngrediente({ ...ingrediente, stockActual: parseInt(event.target.value) })}
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
                  value={ingrediente.precioCosto}
                  onChange={(event) => setIngrediente({ ...ingrediente, precioCosto: parseInt(event.target.value) })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formUM">
                <Form.Label>UM</Form.Label>
                <Form.Select
                  value={ingrediente.unidadMedida}
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
              value={ingrediente.activo ? 'alta' : 'baja'}
              onChange={(event) => setIngrediente({ ...ingrediente, activo: event.target.value === 'alta' })}
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
