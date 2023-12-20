import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { IRubro } from '../../../../interface/IRubro';
import { IEditRubroProductoModalProps } from '../../../../interface/IProducto';

const EditRubroProductoModal: React.FC<IEditRubroProductoModalProps> = ({
  show,
  handleClose,
  handleRubroEdit,
  selectedRubro,
}) => {
  // Estados del componente
  const [nombre, setNombre] = useState('');
  const [activo, setActivo] = useState(false);

  // Actualizar estados cuando se selecciona un rubro
  useEffect(() => {
    if (selectedRubro) {
      setNombre(selectedRubro.nombre);
      setActivo(selectedRubro.activo || false);
      // setIdRubroPadre(selectedRubro.idRubroPadre); (No se utiliza en este componente)
    }
  }, [selectedRubro]);

  // Función para manejar el envío del formulario
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNombre = nombre.trim();
    if (!trimmedNombre || /^\d+$/.test(trimmedNombre)) {
      alert('El nombre no puede estar vacío, contener solo números o ser nulo.');
      return;
    }

    if (selectedRubro) {
      const updatedRubro: IRubro = {
        ...selectedRubro,
        idRubro: selectedRubro.idRubro || 0,
        nombre,
        activo,
        // idRubroPadre, (No se utiliza en este componente)
      };
      handleRubroEdit(updatedRubro);
    }
    handleClose();
  };

  // Función para cambiar el estado
  const handleStatusChange = (isActive: boolean) => {
    setActivo(isActive);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar rubro de producto</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="nombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese nombre"
              name="nombre"
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
