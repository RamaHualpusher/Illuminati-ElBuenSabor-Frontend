import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Rol } from "../../../interface/Rol";
import { EditUsuarioFromAdmin } from "../../../interface/Usuario";
import { EditEmpleadoModalProps } from "../../../interface/Usuario";

const EditEmpleadoModal: React.FC<EditEmpleadoModalProps> = ({
  show,
  handleClose,
  handleEmpleadoEdit,
  selectedEmpleado,
}) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rolId, setRolId] = useState<number | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);

  useEffect(() => {
    fetch("/assets/data/idRolEjemplo.json")
      .then((response) => response.json())
      .then((data) => {
        setRoles(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (selectedEmpleado) {
      setNombre(selectedEmpleado.nombre);
      setApellido(selectedEmpleado.apellido);
      setEmail(selectedEmpleado.email);
      setTelefono(selectedEmpleado.telefono);
      setRolId(selectedEmpleado.Rol.idRol);
    }
  }, [selectedEmpleado]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedEmpleado) {
      const selectedRol = roles.find((rol) => rol.idRol === rolId);
      const updatedEmpleado: EditUsuarioFromAdmin = {
        ...selectedEmpleado,
        nombre,
        apellido,
        email,
        telefono,
        Rol: selectedRol !== undefined ? selectedRol : selectedEmpleado.Rol,
      };
      handleEmpleadoEdit(updatedEmpleado);
    }
    handleClose();
  };


  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Empleado</Modal.Title>
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
              type="email"
              placeholder="Ingrese email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Telefono</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese Teléfono"
              value={telefono}
              onChange={(event) => setTelefono(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRol">
            <Form.Label>Rol</Form.Label>
            <Form.Select
              value={rolId || ""}
              onChange={(event) => setRolId(parseInt(event.target.value))}
              required
            >
              <option value="">Seleccione un rol</option>
              {roles.map((rol) => (
                <option key={rol.idRol} value={rol.idRol}>
                  {rol.nombreRol}
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

export default EditEmpleadoModal;
