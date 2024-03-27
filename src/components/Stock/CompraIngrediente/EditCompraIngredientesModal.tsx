import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import axios from 'axios';
import { IIngredientes, IEditCompraIngredientesModalProps } from '../../../interface/IIngredientes';

const EditCompraIngredientesModal: React.FC<IEditCompraIngredientesModalProps> = ({
  show,
  handleClose,
  handleIngredientesEdit,
  selectedIngredientes,
}) => {
  // Estados locales para almacenar los datos del formulario y los ingredientes
  const [ingredientes, setIngredientes] = useState<IIngredientes[]>([]);
  const [nombre, setNombre] = useState('');
  const [precioCosto, setPrecioCosto] = useState(0);
  const [activo, setActivo] = useState(true);
  const [cantidad, setCantidad] = useState(0);
  const [minStock, setMinStock] = useState(0);
  const [stockActual, setStockActual] = useState(0);
  const [selectedIngredienteId, setSelectedIngredienteId] = useState<number | null>(null);
  const [unidadMedida, setUnidadMedida] = useState('');

  // URL para la carga de datos iniciales
  const API_URL = process.env.REACT_APP_API_URL || "";

  // Efecto para cargar datos iniciales de ingredientes
  useEffect(() => {
    axios.get(API_URL)
      .then(response => {
        const filteredIngredientes = response.data;
        setIngredientes(filteredIngredientes);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  // Efecto para actualizar campos al seleccionar un ingrediente
  useEffect(() => {
    if (selectedIngredientes) {
      setNombre(selectedIngredientes.nombre ?? '');
      setPrecioCosto(selectedIngredientes.precioCosto ?? 0);
      setActivo(selectedIngredientes.activo ?? false);
      setMinStock(selectedIngredientes.stockMinimo ?? 0);
      setStockActual(selectedIngredientes.stockActual ?? 0);
      setUnidadMedida(selectedIngredientes.unidadMedida ?? '');
      setSelectedIngredienteId(selectedIngredientes.id ?? null);
    }
  }, [selectedIngredientes]);


  // Restablecer campos del formulario cuando se muestra el modal
  const resetFormFields = () => {
    setNombre('');
    setPrecioCosto(0);
    setActivo(true);
    setCantidad(0);
    setMinStock(0);
    setStockActual(0);
    setSelectedIngredienteId(null);
    setUnidadMedida('');
  };

  useEffect(() => {
    if (show) {
      resetFormFields();
    }
  }, [show]);

  // Manejar cambio de ingrediente seleccionado
  const handleIngredienteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIngrediente = ingredientes.find(ingrediente => ingrediente.id === parseInt(e.target.value));
    if (selectedIngrediente) {
      setUnidadMedida(selectedIngrediente.unidadMedida);
      setPrecioCosto(selectedIngrediente.precioCosto);
    }
    setSelectedIngredienteId(parseInt(e.target.value));
  };

  // Manejar envío del formulario
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedIngredienteId !== null && selectedIngredientes) {
      // Calcular el nuevo stock actualizado
      const stockUpdated = stockActual + calculateStockFromAmountAndUnit(cantidad, unidadMedida);
      // Crear un nuevo objeto de ingredientes con valores modificados
      const editedIngredientes: IIngredientes = {
        ...selectedIngredientes, // Mantenemos los valores existentes
        stockActual: stockUpdated,
        precioCosto,
        activo,
      };
      // Llamar a la función para editar ingredientes
      handleIngredientesEdit(editedIngredientes);
    }
    handleClose();  // Cerrar el modal
  };

  // Calcular el stock actualizado basado en la cantidad y la unidad de medida
  const calculateStockFromAmountAndUnit = (amount: number, unit: string): number => {
    if (unit === 'Kg') {
      return amount * 1000;
    } else if (unit === 'g') {
      return amount;
    } else if (unit === 'Mg') {
      return amount / 1000;
    } else if (unit === 'l') {
      return amount * 1000;
    } else if (unit === 'Ml') {
      return amount;
    }
    return 0;
  };

  // Renderizar el modal y el formulario
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Compra de Ingredientes</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="formIngrediente">
            <Form.Label>Seleccionar Ingrediente</Form.Label>
            <Form.Select
              value={selectedIngredienteId || ''}
              onChange={handleIngredienteChange}
              required
            >
              <option value="">Seleccione un ingrediente</option>
              {ingredientes.map(ingrediente => (
                <option key={ingrediente.id} value={ingrediente.id}>
                  {ingrediente.nombre}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="formPrecioCosto">
            <Form.Label>Precio de Costo</Form.Label>
            <Form.Control
              type="number"
              value={precioCosto}
              onChange={(e) => setPrecioCosto(parseInt(e.target.value))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              value={activo ? 'alta' : 'baja'}
              onChange={(event) => setActivo(event.target.value === 'alta')}
              required
            >
              <option value="alta">Alta</option>
              <option value="baja">Baja</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="formCantidad">
            <Form.Label>Cantidad</Form.Label>
            <Form.Control
              type="number"
              value={cantidad}
              onChange={(e) => setCantidad(parseInt(e.target.value))}
              required
            />
          </Form.Group>
          <Form.Group controlId="formUM">
            <Form.Label>Unidad de Medida</Form.Label>
            <Form.Control
              plaintext
              readOnly
              value={unidadMedida}
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

export default EditCompraIngredientesModal;