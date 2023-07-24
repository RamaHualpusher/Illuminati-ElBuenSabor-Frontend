import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Rubro } from '../../../interface/Rubro';
import { EditRubroProductoModalProps } from '../../../interface/Producto';
import Axios from 'axios';

const EditRubroProductoModal: React.FC<EditRubroProductoModalProps> = ({
  show,
  handleClose,
  handleRubroEdit,
  selectedRubro,  
}) => {
  const [rubroData, setRubroData] = useState<Rubro>({
    idRubro: selectedRubro?.idRubro || 0,
    nombre: selectedRubro?.nombre || '',
    idRubroPadre: selectedRubro?.idRubroPadre || undefined,
    activo: false,
  });

  useEffect(() => {
    if (selectedRubro !== null) {
      setRubroData(selectedRubro);
    }
  }, [selectedRubro]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleRubroEdit(rubroData);
    handleClose();
  };

  const handleStatusChange = (isActivo: boolean) => {
    setRubroData((prevState) => ({
      ...prevState,
      activo: isActivo,
    }));
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRubroData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
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
              value={rubroData.nombre}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formActivo">
            <Form.Label>Estado</Form.Label>
            <div>
              <Button
                variant={rubroData.activo ? 'primary' : 'outline-primary'}
                className={rubroData.activo ? 'mr-2' : ''}
                onClick={() => handleStatusChange(true)}
              >
                Activo
              </Button>
              <Button
                variant={!rubroData.activo ? 'primary' : 'outline-primary'}
                onClick={() => handleStatusChange(false)}
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
