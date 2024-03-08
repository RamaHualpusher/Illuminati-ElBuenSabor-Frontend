import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Col, Row } from 'react-bootstrap';
import { IIngredientes } from '../../../interface/IIngredientes';
import { IRubro } from '../../../interface/IRubro';
import { IAddIngredienteModalProps } from '../../../interface/IIngredientes';
import axios from 'axios';

const AddIngredienteModal: React.FC<IAddIngredienteModalProps> = ({
  show,
  handleClose,
  handleIngredienteAdd,
}) => {
  // Función para inicializar un nuevo ingrediente
  const initializeNewIngrediente = (): IIngredientes => ({
    id: 0,
    nombre: '',
    activo: true,
    stockMinimo: 0,
    stockActual: 0,
    precioCosto: 0,
    rubro: { id: 0, activo:false,nombre:""},
    unidadMedida: '',
  });

  const [newIngrediente, setNewIngrediente] = useState<IIngredientes>(initializeNewIngrediente);
  const [rubros, setRubros] = useState<IRubro[]>([]);
  const unidades = ["Kg", "g", "Mg", "l", "Ml"];
  const [selectedRubro, setSelectedRubro] = useState<IRubro | null>(null);
  const API_URL = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const response = await axios.get(API_URL+"rubro");
        setRubros(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRubros();
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newIngrediente.nombre || !newIngrediente.rubro.id || isNaN(newIngrediente.rubro.id) || !newIngrediente.stockMinimo || !newIngrediente.stockActual || !newIngrediente.precioCosto || !newIngrediente.unidadMedida) {
      console.log('Faltan campos requeridos');
      console.log(newIngrediente);
      return;
    }

    if (!newIngrediente.rubro) {
      console.log('Rubro inválido');
      return;
    }

    const updatedIngrediente: IIngredientes = {
      ...newIngrediente,
      rubro: { id: newIngrediente.rubro.id, nombre: newIngrediente.rubro.nombre },
    };

    handleIngredienteAdd(updatedIngrediente);
    handleClose();
  };

  const handleCancelar = () => {
    setNewIngrediente(initializeNewIngrediente());
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} >
      <Modal.Header closeButton>
        <Modal.Title>Agregar Ingrediente</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese nombre"
                  value={newIngrediente.nombre}
                  onChange={(event) => setNewIngrediente({ ...newIngrediente, nombre: event.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formRubro">
                <Form.Label>Rubro</Form.Label>
                <Form.Select
                   onChange={(event) => {
                    const rubroId = parseInt(event.target.value);
                    const selectedRubro = rubros.find((rubro) => rubro.id === rubroId);
                    if (selectedRubro) {
                      setNewIngrediente({ ...newIngrediente, rubro: selectedRubro });
                    }
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
                  value={newIngrediente.stockMinimo}
                  onChange={(event) => setNewIngrediente({ ...newIngrediente, stockMinimo: parseInt(event.target.value) })}
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
                  value={newIngrediente.stockActual}
                  onChange={(event) => setNewIngrediente({ ...newIngrediente, stockActual: parseInt(event.target.value) })}
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
                  value={newIngrediente.precioCosto}
                  onChange={(event) => setNewIngrediente({ ...newIngrediente, precioCosto: parseInt(event.target.value) })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formUM">
                <Form.Label>UM</Form.Label>
                <Form.Select
                  value={newIngrediente.unidadMedida}
                  onChange={(event) => setNewIngrediente({ ...newIngrediente, unidadMedida: event.target.value })}
                  required
                >
                  {unidades.map((unidad) => (
                    <option key={unidad} value={unidad}>
                      {unidad}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3" controlId="formEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              value={newIngrediente.activo ? 'alta' : 'baja'}
              onChange={(event) =>
                setNewIngrediente({ ...newIngrediente, activo: event.target.value === 'alta' })
              }
              required
            >
              <option value="alta">Alta</option>
              <option value="baja">Baja</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancelar}>
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

export default AddIngredienteModal;
