import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
//import { Empleado, Rol } from "./EmpleadoTable";
import axios from "axios";
import {Rol, Empleado } from "../../../interface/interfaces";

type AddEmpleadoModalProps = {
  show: boolean;
  handleClose: () => void;
  handleEmpleadoAdd: (empleado: Empleado) => void;
};

const AddEmpleadoModal = ({
  show,
  handleClose,
  handleEmpleadoAdd,
}: AddEmpleadoModalProps) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [estado, setEstado] = useState(0);
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);

  useEffect(() => {
    axios.get<Rol[]>("URL_DEL_ENDPOINT_ROLES")
      .then(response => {
        setRoles(response.data);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newEmpleado: Empleado = {
      id: 0,
      nombre,
      apellido,
      email,
      estado,
      rol: selectedRol || { idRol: 0, nombreRol: "" }, // Asignamos el rol seleccionado o un objeto vacío si no se seleccionó ningún rol
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
              value={selectedRol?.idRol || ""}
              onChange={(event) => {
                const selectedIdRol = Number(event.target.value);
                const selectedRol = roles.find(rol => rol.idRol === selectedIdRol);
                setSelectedRol(selectedRol || null);
              }}
              required
            >
              <option value="">Seleccione un rol</option>
              {roles.map(rol => (
                <option key={rol.idRol} value={rol.idRol}>
                  {rol.nombreRol}
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