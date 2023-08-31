import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AddRubroProductoModalProps } from '../../../../interface/Producto';
import { Rubro } from '../../../../interface/Rubro';

const AddRubroProductoModal: React.FC<AddRubroProductoModalProps> = ({
  show,
  handleClose,
  handleRubroAdd,
}) => {
  // Estados del componente
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState(true);

  // Función para manejar el envío del formulario
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNombre = nombre.trim();
    if (!trimmedNombre || /^\d+$/.test(trimmedNombre)) {
      alert('El nombre no puede estar vacío, contener solo números o ser nulo.');
      return;
    }

    const newRubroProducto: Rubro = {
      idRubro: 0,
      nombre: trimmedNombre,
      estado,
      idRubroPadre: undefined,
    };
    handleRubroAdd(newRubroProducto); // Pasar el objeto rubroData directamente a handleRubroAdd
    handleClose();
  };

  // Función para cambiar el estado
  const handleStatusChange = (isActive: boolean) => {
    setEstado(isActive);
  };


  const handleCancelar=()=>{
    setNombre("");
    setEstado(true);
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar rubro de producto</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formNombre">
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

export default AddRubroProductoModal;
