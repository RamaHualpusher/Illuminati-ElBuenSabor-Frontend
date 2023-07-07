import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { Rubro } from '../../../interface/Rubro';
import { EditRubroProductoModalProps } from '../../../interface/Producto';

const EditRubroProductoModal: React.FC<EditRubroProductoModalProps> = ({
  show,
  handleClose,
  handleRubroEdit,
  selectedRubro,
}) => {
  const [nombre, setNombre] = useState('');
  const [rubroId, setRubroId] = useState<number | null>(null);  
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
      setNombre(selectedRubro?.nombre || '');
      setRubroId(selectedRubro?.idRubro || null);      
    }
  }, [selectedRubro]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedRubro) {
      const updatedRubro: Rubro = {
        ...selectedRubro,
        nombre,        
        idRubroPadre: selectedRubro.idRubroPadre,
      };
      handleRubroEdit(updatedRubro);
    }
    handleClose();
  };

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
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRubro">
            <Form.Label>Rubro</Form.Label>
            <Form.Select
              value={selectedRubro?.idRubro || ''}
              onChange={(event) => {
                const rubroId = parseInt(event.target.value);
                const rubro = rubros.find((rubro) => rubro.idRubro === rubroId);
                setRubroId(rubroId);                
              }}
              required
            >
              <option value="">Seleccione un rubro</option>
              {rubros.map((rubro) => (
                <option key={rubro.idRubro} value={rubro.idRubro}>
                  {rubro.nombre}
                </option>
              ))}
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
