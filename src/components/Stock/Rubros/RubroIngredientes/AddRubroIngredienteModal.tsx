import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { IRubroNew } from '../../../../interface/IRubro';
import { IAddRubroIngredienteModalProps } from '../../../../interface/IIngredientes';

const AddRubroIngredienteModal: React.FC<IAddRubroIngredienteModalProps> = ({
  show,
  handleClose,
  handleRubroAdd,
}) => {
  // Estados del componente
  const [nombre, setNombre] = useState('');
  const [activo, setActivo] = useState(true);
  const [rubros, setRubros] = useState<IRubroNew[]>([]);
  const [filteredRubros, setFilteredRubros] = useState<IRubroNew[] | null>(null);

  // Cargar los rubros al montar el componente
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

  // Manejar el envío del formulario
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNombre = nombre.trim();
    if (!trimmedNombre || /^\d+$/.test(trimmedNombre)) {
      alert('El nombre no puede estar vacío, contener solo números o ser nulo.');
      return;
    }

    const newRubroIngrediente: IRubroNew = {
      id: 0,
      nombre: trimmedNombre,
      activo: activo,
      rubroPadre: undefined,
      ingredientOwner: true,
    };

    handleRubroAdd(newRubroIngrediente);  // Se pasa el objeto rubroData directamente a handleRubroAdd
    handleClose();
  };

  // Cambiar el estado del rubro
  const handleStatusChange = (isActive: boolean) => {
    setActivo(isActive);
  };

  // Filtrar rubros según el término de búsqueda
  const handleSearch = (searchTerm: string) => {
    // Verificar si la lista de rubros existe antes de llamar a filter
    const filteredRubros = rubros?.filter((rubro) =>
      rubro.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRubros(filteredRubros);
  };

  const handleCancelar = () => {
    setNombre("");
    setActivo(true);
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Rubro Ingrediente</Modal.Title>
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

export default AddRubroIngredienteModal;
