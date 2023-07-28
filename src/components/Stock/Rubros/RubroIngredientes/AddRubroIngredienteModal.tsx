import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Rubro } from '../../../../interface/Rubro';
import { AddRubroIngredienteModalProps } from '../../../../interface/Ingredientes';

const AddRubroIngredienteModal: React.FC<AddRubroIngredienteModalProps> = ({
  show,
  handleClose,
  handleRubroAdd,
}) => {
  const [nombre, setNombre] = useState('');
  const [activo, setActivo] = useState(false);
  const [idRubroPadre, setIdRubroPadre] = useState(null);
  const [filteredRubros, setFilteredRubros] = useState<Rubro[] | null>(null); 
  const [rubros, setRubros] = useState<Rubro[]>([]);

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNombre = nombre.trim();
    if (!trimmedNombre || /^\d+$/.test(trimmedNombre)) {
      alert('El nombre no puede estar vacío, contener solo números o ser nulo.');
      return;
    }

    const newRubroIngrediente : Rubro ={
      idRubro: 0,
      nombre: trimmedNombre,
      activo: false, 
      idRubroPadre: undefined,
    }
    handleRubroAdd(newRubroIngrediente); // Se pasa el objeto rubroData directamente a handleRubroAdd
    handleClose();
  };

  const handleStatusChange = (isActive: boolean) => {
    setActivo(isActive);
  };

  const handleSearch = (searchTerm: string) => {
    // Verificar si la lista de rubros existe antes de llamar a filter
    const filteredRubros = rubros?.filter((rubro) =>
      rubro.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRubros(filteredRubros);
  };

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
          <Form.Group className="mb-3" controlId="formRubro">
          <Form.Label>Estado</Form.Label>
            <div>
              <Button
                variant={activo ? 'outline-primary' : 'primary'}
                className="mr-2"
                onClick={() => handleStatusChange(false)}
              >
                Activo
              </Button>
              <Button
                variant={activo ? 'primary' : 'outline-primary'}
                onClick={() => handleStatusChange(true)}
              >
                Inactivo
              </Button>
              </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
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
