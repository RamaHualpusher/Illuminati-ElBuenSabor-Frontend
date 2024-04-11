import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { IRubroNew } from '../../../../interface/IRubro';

interface IAddRubroProductoModalProps {
  show: boolean;
  handleClose: () => void;
  handleRubroAdd: (rubro: IRubroNew) => void;
  categorias: IRubroNew[];
}

const AddRubroProductoModal: React.FC<IAddRubroProductoModalProps> = ({
  show,
  handleClose,
  handleRubroAdd,
  categorias,
}) => {
  const [nombre, setNombre] = useState('');
  const [esCategoria, setEsCategoria] = useState(false);
  const [rubroPadreId, setRubroPadreId] = useState<number>(0); 

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedNombre = nombre.trim();
    if (!trimmedNombre || /^\d+$/.test(trimmedNombre)) {
      alert('El nombre no puede estar vacío, contener solo números o ser nulo.');
      return;
    }

    const rubroPadre = esCategoria ? undefined : categorias.find(rubro => rubro.id === rubroPadreId);

    const newRubroProducto: IRubroNew = {
      id: 0,
      nombre: trimmedNombre,
      activo: true,
      rubroPadre,
      ingredientOwner: false,
    };
    handleRubroAdd(newRubroProducto);
    handleClose();
  };

  const handleEsCategoriaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEsCategoria(event.target.checked);
    // Limpiar el campo de rubroPadreId cuando se marca/desmarca el checkbox
    setRubroPadreId(0);
  };

  const handleRubroPadreChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setRubroPadreId(parseInt(event.target.value));
  };

  const handleCancelar = () => {
    setNombre('');
    setEsCategoria(false);
    setRubroPadreId(0);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Rubro de Producto</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formNombre">
            <Form.Label>Nombre</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="Ingrese nombre"
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEsCategoria">
            <Form.Check
              type="checkbox"
              label="Es categoría"
              checked={esCategoria}
              onChange={handleEsCategoriaChange}
            />
          </Form.Group>
          {!esCategoria && (
            <Form.Group className="mb-3" controlId="formRubroPadre">
              <Form.Label>Rubro Padre</Form.Label>
              <Form.Select value={rubroPadreId} onChange={handleRubroPadreChange}>
                <option value={0}>Seleccionar</option>
                {categorias.map(rubro => (
                  <option key={rubro.id} value={rubro.id}>{rubro.nombre}</option>
                ))}
              </Form.Select>
            </Form.Group>
          )}
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