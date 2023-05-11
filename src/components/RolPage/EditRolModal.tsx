import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Rol } from "./RolTable";
import axios from "axios";

type EditRolModalProps = {
  show: boolean;
  handleClose: () => void;
  handleRolEdit: (rol: Rol) => void;
  selectedRol: Rol | null;
};

const EditRolModal = ({
  show,
  handleClose,
  handleRolEdit,
  selectedRol,
}: EditRolModalProps) => {
  const [idRol, setIdRol] = useState(selectedRol?.idRol || "");
  const [nombreRol, setNombreRol] = useState(selectedRol?.nombreRol || "");

  useEffect(() => {
    setIdRol(selectedRol?.idRol || "");
    setNombreRol(selectedRol?.nombreRol || "");
  }, [selectedRol]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedRol) {
      const updatedRol: Rol = {
        idRol: selectedRol.idRol,
        nombreRol,
      };
      handleRolEdit(updatedRol);
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Rol</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formIdRol">
            <Form.Label>ID Rol</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese ID Rol"
              value={idRol}
              onChange={(event) => setIdRol(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formNombreRol">
            <Form.Label>Nombre Rol</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese nombre de Rol"
              value={nombreRol}
              onChange={(event) => setNombreRol(event.target.value)}
              required
            />
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

export default EditRolModal;
