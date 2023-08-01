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
  const [claveConfirm, setClaveConfirm] = useState("");
  const [telefono, setTelefono] = useState("");
  const [calle, setCalle] = useState("");
  const [numero, setNumero] = useState("");
  const [estado, setEstado] = useState(true);
  const [localidad, setLocalidad] = useState("");
  const [selectedRol, setSelectedRol] = useState<Rol | null>(null);
  const [selectedDomicilio, setSelectedDomicilio] = useState<Domicilio | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [domicilios, setDomicilios] = useState<Domicilio>();
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [passwordValid, setPasswordValid] = useState(true);

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (clave !== claveConfirm) {
      setPasswordsMatch(false);
      return;
    } else {
      setPasswordsMatch(true);
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(clave)) {
      setPasswordValid(false);
      return;
    } else {
      setPasswordValid(true);
    }

    const newEmpleado: Usuario = {
      idUsuario: 0,
      nombre,
      apellido,
      email,
      clave,
      claveConfirm,
      telefono,
      estado,
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
            <Form.Label>Contraseña Provisional</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingrese contraseña"
              value={clave}
              onChange={(event) => setClave(event.target.value)}
              required
              isInvalid={!passwordsMatch || !passwordValid}
            />
            {!passwordsMatch && <Form.Control.Feedback type="invalid">Las contraseñas no coinciden.</Form.Control.Feedback>}
            {!passwordValid && <Form.Control.Feedback type="invalid">La contraseña debe tener un mínimo de 8 caracteres, al menos una letra mayúscula, una letra minúscula y un símbolo.</Form.Control.Feedback>}
          </Form.Group>
          <Form.Group className="mb-3" controlId="formClave2">
            <Form.Label>Confirmar Contraseña Provisional</Form.Label>
            <Form.Control
              type="password"
              placeholder="Confirmar contraseña"
              value={claveConfirm}
              onChange={(event) => setClaveConfirm(event.target.value)}
              required
              isInvalid={!passwordsMatch}
            />
            {!passwordsMatch && <Form.Control.Feedback type="invalid">Las contraseñas no coinciden.</Form.Control.Feedback>}
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
          <Form.Group className="mb-3" controlId="formEstado">
            <Form.Label>Estado</Form.Label>
            <Form.Select
              value={estado ? 'activo' : 'bloqueado'}
              onChange={(event) =>
                setEstado(event.target.value === 'activo' ? true : false)
              }
              required
            >
              <option value="activo">Activo</option>
              <option value="bloqueado">Bloqueado</option>
            </Form.Select>
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
