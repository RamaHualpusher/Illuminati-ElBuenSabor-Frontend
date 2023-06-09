import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Rol } from "../../../interface/Rol";
import { Usuario } from "../../../interface/Usuario";
import { Domicilio } from "../../../interface/Domicilio";
import { AddEmpleadoModalProps } from "../../../interface/Usuario";

const AddEmpleadoModal: React.FC<AddEmpleadoModalProps> = ({
  show,
  handleClose,
  handleEmpleadoAdd,
}) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [clave, setClave] = useState("");
  const [telefono, setTelefono] = useState("");
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [localidad, setLocalidad] = useState("");
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [selectedDomicilio, setSelectedDomicilio] = useState<Domicilio | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [domicilios, setDomicilios] = useState<Domicilio>();

  useEffect(() => {
    fetch("/assets/data/idRolEjemplo.json")
      .then((response) => response.json())
      .then((data) => {
        setRoles(data);
      })
      .catch((error) => {
        console.log(error);
      });

    fetch("/assets/data/productosEjemplo.json")
      .then((response) => response.json())
      .then((data) => {
        setDomicilios(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newEmpleado: Usuario = {
      idUsuario: 0,
      nombre,
      apellido,
      email,
      clave,
      telefono,
      Rol: selectedRol || { idRol: 0, nombreRol: "" },
      Domicilio: selectedDomicilio || { idDomicilio: 0, calle: "", numero: 0, localidad: "" },
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
          <Form.Group className="mb-3" controlId="formClave">
            <Form.Label>Clave</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingrese clave"
              value={clave}
              onChange={(event) => setClave(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formTelefono">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese teléfono"
              value={telefono}
              onChange={(event) => setTelefono(event.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formRol">
            <Form.Label>Rol</Form.Label>
            <Form.Control
              as="select"
              value={selectedRol?.idRol || ""}
              onChange={(event) => {
                const selectedIdRol = parseInt(event.target.value);
                const selectedRol = roles.find((rol) => rol.idRol === selectedIdRol) || null;
                setSelectedRol(selectedRol);
              }}
              required
            >
              <option value="">Seleccione un rol</option>
              {roles.map((rol) => (
                <option key={rol.idRol} value={rol.idRol}>
                  {rol.nombreRol}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <Form.Group className="mb-3" controlId="formDomicilio">
            <Form.Label>Domicilio:</Form.Label>
            <Row>
              <Col>
                <Form.Label>Calle</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese calle"
                  value={calle}
                  onChange={(event) => setCalle(event.target.value)}
                  required
                />
              </Col>
              <Col>
                <Form.Label>Número</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingrese número"
                  value={numero}
                  onChange={(event) => setNumero(event.target.value)}
                  required
                />
              </Col>
              <Col>
                <Form.Label>Localidad</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese localidad"
                  value={localidad}
                  onChange={(event) => setLocalidad(event.target.value)}
                  required
                />
              </Col>
            </Row>
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
