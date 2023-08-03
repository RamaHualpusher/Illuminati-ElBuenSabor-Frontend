import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { AddRubroProductoModalProps } from '../../../../interface/Producto';
import { Rubro } from '../../../../interface/Rubro';

const AddRubroProductoModal: React.FC<AddRubroProductoModalProps> = ({
  show,
  handleClose,
  handleRubroAdd,
}) => {
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState(true);
  const [idRubroPadre, setIdRubroPadre] = useState(null);
  const [filteredRubros, setFilteredRubros] = useState<Rubro[] | null>(null);
  const [rubros, setRubros] = useState<Rubro[]>([]);

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
      estado: false,
      idRubroPadre: undefined,
    }
    handleRubroAdd(newRubroProducto); // Se pasa el objeto rubroData directamente a handleRubroAdd
    handleClose();
  };

  const handleStatusChange = (isActive: boolean) => {
    setEstado(isActive);
  };

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

export default AddRubroProductoModal;