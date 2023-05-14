import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Empleado } from "../../../interface/interfaces";

interface AddEmpleadoModalProps {
  show: boolean;
  handleClose: () => void;
  handleEmpleadoAdd: (empleado: Empleado) => void;
}

const AddEmpleadoModal: React.FC<AddEmpleadoModalProps> = ({
  show,
  handleClose,
  handleEmpleadoAdd,
}) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState(0);
  const [selectedRol, setSelectedRol] = useState<string | null>(null);
  const [roles, setRoles] = useState<string[]>([]);


  useEffect(() => {
    fetch("URL_DEL_ENDPOINT_ROLES")
      .then((response) => response.json())
      .then((data) => {
        setRoles(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newEmpleado: Empleado = {
      Id: 0,
      Nombre: nombre,
      Apellido: apellido,
      Email: email,
      Rol: selectedRol || "",
      Estado: estado,
    };

    handleEmpleadoAdd(newEmpleado);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Empleado</Modal.Title>
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
          <Form.Group className="mb-3" controlId="formApellido">
            <Form.Label>Apellido</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese apellido"
              value={apellido}
              onChange={(event) => setApellido(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese estado"
              value={estado}
              onChange={(event) => setEstado(Number(event.target.value))}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRol">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              as="select"
              value={selectedRol || ""}
              onChange={(event) => setSelectedRol(event.target.value)}
              required
            >
              <option value="">Seleccione un rol</option>
              {roles.map((rol) => (
                <option key={rol} value={rol}>
                  {rol}
                </option>
              ))}
            </Form.Control>
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

export default AddEmpleadoModal;