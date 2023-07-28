import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Rubro } from '../../../../interface/Rubro';
import { EditRubroProductoModalProps } from '../../../../interface/Producto';

const EditRubroProductoModal: React.FC<EditRubroProductoModalProps> = ({
  show,
  handleClose,
  handleRubroEdit,
  selectedRubro,
}) => {
  const [nombre, setNombre] = useState('');
  const [estado, setEstado] = useState(false);
  const [idRubroPadre, setIdRubroPadre] = useState<Rubro | undefined>(undefined);

  useEffect(() => {
    if (selectedRubro) {
      setNombre(selectedRubro.nombre);
      setEstado(selectedRubro.estado || false);
      setIdRubroPadre(selectedRubro.idRubroPadre);
    }
  }, [selectedRubro]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNombre = nombre.trim();
    if (!trimmedNombre || /^\d+$/.test(trimmedNombre)) {
      alert('El nombre no puede estar vacío, contener solo números o ser nulo.');
      return;
    }

    if (selectedRubro) {
      const updatedRubro: Rubro = {
        ...selectedRubro,
        idRubro: selectedRubro.idRubro || 0,
        nombre,
        estado,
        idRubroPadre,
      };
      handleRubroEdit(updatedRubro);
    }
    handleClose();
  };

  // const handleStatusChange = (isActivo: boolean) => {
  //   setRubroData((prevState) => ({
  //     ...prevState,
  //     activo: isActivo,
  //   }));
  // };

  // const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = event.target;
  //   setRubroData((prevState) => ({
  //     ...prevState,
  //     [name]: value,
  //   }));
  // };

  const handleStatusChange = (isActive: boolean) => {
    setEstado(isActive);
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
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditRubroProductoModal;
