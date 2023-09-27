import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Ingredientes } from '../../../interface/Ingredientes';
import { Rubro } from '../../../interface/Rubro';
import { AddIngredienteModalProps } from '../../../interface/Ingredientes';
import axios from 'axios';

const AddIngredienteModal: React.FC<AddIngredienteModalProps> = ({
  show,
  handleClose,
  handleIngredienteAdd,
}) => {
  // Estados para los campos del formulario
  const [nombre, setNombre] = useState('');
  const [rubroId, setRubroId] = useState<number | null>(null);
  const [minStock, setMinStock] = useState(0);
  const [stockActual, setStockActual] = useState(0);
  const [precioCosto, setPrecioCosto] = useState(0);
  const [um, setUM] = useState('');
  const [estado, setEstado] = useState(true);
  const [rubros, setRubros] = useState<Rubro[]>([]);
  const unidades = ["Kg", "g", "Mg", "l", "Ml"];

  // Cargar los rubros al cargar el componente
  useEffect(() => {
    const fetchRubros = async () => {
      try {
        const response = await axios.get<Rubro[]>('/assets/data/rubrosIngredientesEjemplo.json');
        setRubros(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRubros();
  }, []);

  // Manejar el envío del formulario
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Verificar que todos los campos requeridos estén completos
    if (!nombre || !rubroId || isNaN(rubroId) || !minStock || !stockActual || !precioCosto || !um) {
      console.log('Faltan campos requeridos');
      return;
    }

    // Encontrar el rubro seleccionado
    const selectedRubro = rubros.find((rubro) => rubro.idRubro === rubroId);
    if (!selectedRubro) {
      console.log('Rubro inválido');
      return;
    }


    

    // Crear un nuevo objeto Ingredientes con los datos del formulario
    const newIngrediente: Ingredientes = {
      idIngredientes: 0,
      nombre,
      estado,
      stockMinimo: minStock,
      stockActual,
      precioCosto,
      Rubro: { idRubro: rubroId, nombre: selectedRubro.nombre },
      unidadMedida: um
    };

    // Llamar a la función para agregar el ingrediente y cerrar el modal
    handleIngredienteAdd(newIngrediente);
    handleClose();

    
  };
  

  const handleCancelar=()=>{
    setNombre("");
    setRubroId(0);
    setEstado(true);
    setMinStock(0);
    setPrecioCosto(0);
    setStockActual(0);
    setUM("");
    handleClose();
  };




  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Ingrediente</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {/* Formulario para ingresar datos del ingrediente */}
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
              onChange={(event) => setUM(event.target.value)}
              required
            >
              {unidades.map((unidades) =>
                <option value={unidades}>{unidades}</option>
              )}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              value={estado ? 'alta' : 'baja'}
              onChange={(event) =>
                setEstado(event.target.value === 'alta' ? true : false)
              }
              required
            >
              <option value="alta">Alta</option>
              <option value="baja">Baja</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          {/* Botones para cancelar y agregar */}
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