import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

type AddRolModalProps = {
  show: boolean;
  handleClose: () => void;
  handleRolAdd: (rol: Rol) => void;
};

export type Rol = {
  idRol: number;
  nombreRol: string;
};

const AddRolModal = ({
  show,
  handleClose,
  handleRolAdd,
}: AddRolModalProps) => {
  const [idRol, setIdRol] = useState(0);
  const [nombreRol, setNombreRol] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newRol: Rol = {
      idRol,
      nombreRol,
    };
    handleRolAdd(newRol);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Rol</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formIdRol">
            <Form.Label>ID Rol</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese ID Rol"
              value={idRol}
              onChange={(event) => setIdRol(parseInt(event.target.value))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formNombreRol">
            <Form.Label>Nombre Rol</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese Nombre Rol"
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
            Agregar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddRolModal;
