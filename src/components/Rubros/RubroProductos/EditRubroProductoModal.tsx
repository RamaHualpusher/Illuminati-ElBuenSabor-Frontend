import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Rubro } from '../../../interface/Rubro';
import { EditRubroProductoModalProps } from '../../../interface/Producto';

interface EditRubroProductoModalState {
  nombre: string;
  activo: boolean;
}

const EditRubroProductoModal: React.FC<EditRubroProductoModalProps> = ({
  show,
  handleClose,
  handleRubroEdit,
  selectedRubro,
}) => {
  const [formState, setFormState] = useState<EditRubroProductoModalState>({
    nombre: '',
    activo: false,
  });
  const [rubros, setRubros] = useState<Rubro[]>([]);

  useEffect(() => {
    fetch('/assets/data/rubrosProductosEjemplo.json')
      .then((response) => response.json())
      .then((data: Rubro[]) => {
        setRubros(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (selectedRubro) {
      setFormState((prevState) => ({
        ...prevState,
        nombre: selectedRubro.nombre || '',
        activo: selectedRubro.activo || false,
      }));
    }
  }, [selectedRubro]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedRubro) {
      const updatedRubro: Rubro = {
        ...selectedRubro,
        nombre: formState.nombre,
        activo: formState.activo,
      };
      handleRubroEdit(updatedRubro);
    }
    handleClose();
  };

  const handleStatusChange = (isActivo: boolean) => {
    setFormState((prevState) => ({
      ...prevState,
      activo: isActivo,
    }));
  };

  const updateJsonData = (rubrosData: Rubro[]) => {
    fetch('/assets/data/rubrosProductosEjemplo.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(rubrosData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Data updated successfully:', data);
      })
      .catch((error) => {
        console.log('Error updating data:', error);
      });
  };

  useEffect(() => {
    if (selectedRubro) {
      setFormState({
        nombre: selectedRubro.nombre || '',
        activo: selectedRubro.activo || false,
      });
    }
  }, [selectedRubro]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Rubro</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese nombre"
              value={formState.nombre}
              onChange={(event) =>
                setFormState((prevState) => ({
                  ...prevState,
                  nombre: event.target.value,
                }))
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRubro">
            <Form.Label>Estado</Form.Label>
            <div>
              <Button
                variant={formState.activo ? 'outline-primary' : 'primary'}
                className="mr-2"
                onClick={() => handleStatusChange(false)}
              >
                Activo
              </Button>
              <Button
                variant={formState.activo ? 'primary' : 'outline-primary'}
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
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};


export default EditRubroProductoModal;
