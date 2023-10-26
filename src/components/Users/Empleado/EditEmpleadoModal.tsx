import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Rol } from "../../../interface/Rol";
import { EditUsuarioFromAdmin } from "../../../interface/Usuario";
import { EditEmpleadoModalProps } from "../../../interface/Usuario";

const EditEmpleadoModal: React.FC<EditEmpleadoModalProps> = ({
  show,
  handleClose,
  handleEmpleadoEdit,
  selectedEmpleado,
}) => {
  // Función para inicializar un nuevo objeto Usuario
  const initializeUsuario = (empleado: EditUsuarioFromAdmin | null): EditUsuarioFromAdmin => {
    return empleado || {
      idUsuario: 0,
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      estado: true,
      Rol: { idRol: 0, nombreRol: "" },
    };
  };

  const [empleado, setEmpleado] = useState<EditUsuarioFromAdmin>(initializeUsuario(selectedEmpleado));
  const [roles, setRoles] = useState<Rol[]>([]);

  // Cargar roles al montar el componente
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

  // Actualizar campos al seleccionar un cliente
  useEffect(() => {
    if (selectedEmpleado) {
      setEmpleado(selectedEmpleado);
    }
  }, [selectedEmpleado]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleEmpleadoEdit(empleado);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Empleado</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese nombre"
                  value={empleado.nombre}
                  onChange={(event) => setEmpleado({ ...empleado, nombre: event.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formApellido">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese apellido"
                  value={empleado.apellido}
                  onChange={(event) => setEmpleado({ ...empleado, apellido: event.target.value })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Ingrese email"
                  value={empleado.email}
                  onChange={(event) => setEmpleado({ ...empleado, email: event.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formTelefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese teléfono"
                  value={empleado.telefono}
                  onChange={(event) => setEmpleado({ ...empleado, telefono: event.target.value })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formEstado">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={empleado.estado ? 'activo' : 'bloqueado'}
                  onChange={(event) => setEmpleado({ ...empleado, estado: event.target.value === 'activo' })}
                  required
                >
                  <option value="activo">Activo</option>
                  <option value="bloqueado">Bloqueado</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="formRol">
                <Form.Label>Rol</Form.Label>
                <Form.Select
                  value={empleado.Rol.idRol || ""}
                  onChange={(event) => setEmpleado({ ...empleado, Rol: { ...empleado.Rol, idRol: parseInt(event.target.value) } })}
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
            </Col>
          </Row>
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
    </Modal >
  );
};

export default EditEmpleadoModal;
