import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Rol } from "../../../interface/Rol";
import { Usuario } from "../../../interface/Usuario";
import { AddEmpleadoModalProps } from "../../../interface/Usuario";
import axios from "axios";

const AddEmpleadoModal: React.FC<AddEmpleadoModalProps> = ({
  show,
  handleClose,
  handleEmpleadoAdd,
}) => {
  // Función para inicializar un nuevo objeto Usuario
  const initializeNewUsuario = (): Usuario => {
    return {
      idUsuario: 0,
      nombre: "",
      apellido: "",
      email: "",
      clave: "",
      claveConfirm: "",
      telefono: "",
      estado: true,
      Rol: { idRol: 0, nombreRol: "" },
      Domicilio: {
        idDomicilio: 0,
        calle: "",
        numero: 0,
        localidad: "",
      },
    };
  };

  const [usuario, setUsuario] = useState<Usuario>(initializeNewUsuario);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [claveCoincide, setClaveCoincide] = useState(true);
  const [claveValida, setClaveValida] = useState(true);
  const [emailValido, setEmailValido] = useState(true);
  const [emailEnUso, setEmailEnUso] = useState(false);
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

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

  const handleCancelar = () => {
    setUsuario(initializeNewUsuario)
    handleClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Verificar si el email ya está en uso
    try {
      const response = await axios.get(`assets/data/empleadoTabla.json`);
      const empleados = response.data; // Supongo que el objeto contiene una lista de empleados

      // Verificar si el email ya está en uso
      const emailExists = empleados.some((empleado: any) => empleado.email === usuario.email);

      if (emailExists) {
        setEmailEnUso(true);
        return;
      } else {
        setEmailEnUso(false);
      }
    } catch (error) {
      console.error("Error al verificar el email:", error);
      return;
    }

    // Verificar dirección de correo electrónico
    if (!emailRegex.test(usuario.email)) {
      setEmailValido(false);
      return;
    } else {
      setEmailValido(true);
    }

    if (usuario.clave !== usuario.claveConfirm) {
      setClaveCoincide(false);
      return;
    } else {
      setClaveCoincide(true);
    }

    if (!passwordRegex.test(usuario.clave)) {
      setClaveValida(false);
      return;
    } else {
      setClaveValida(true);
    }

    handleEmpleadoAdd(usuario);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Agregar Empleado</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formNombre">
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese nombre"
                  value={usuario.nombre}
                  onChange={(event) => setUsuario({ ...usuario, nombre: event.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formApellido">
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese apellido"
                  value={usuario.apellido}
                  onChange={(event) => setUsuario({ ...usuario, apellido: event.target.value })}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese email"
                  value={usuario.email}
                  onChange={(event) => setUsuario({ ...usuario, email: event.target.value })}
                  required
                  isInvalid={!emailValido || emailEnUso}
                />
                {!emailValido && <Form.Control.Feedback type="invalid">Email no válido.</Form.Control.Feedback>}
                {emailEnUso && <Form.Control.Feedback type="invalid">Este email ya está en uso.</Form.Control.Feedback>}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formRol">
                <Form.Label>Rol</Form.Label>
                <Form.Control
                  as="select"
                  value={usuario.Rol.idRol || ""}
                  onChange={(event) => {
                    const selectedIdRol = parseInt(event.target.value);
                    const selectedRol = roles.find((rol) => rol.idRol === selectedIdRol) || { idRol: 0, nombreRol: "" };
                    setUsuario({ ...usuario, Rol: selectedRol });
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
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formClave">
                <Form.Label>Contraseña Provisional</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Ingrese contraseña"
                  value={usuario.clave}
                  onChange={(event) => setUsuario({ ...usuario, clave: event.target.value })}
                  required
                  isInvalid={!claveCoincide || !claveValida}
                />
                {!claveCoincide && <Form.Control.Feedback type="invalid">Las contraseñas no coinciden.</Form.Control.Feedback>}
                {!claveValida && <Form.Control.Feedback type="invalid">La contraseña debe tener un mínimo de 8 caracteres, al menos una letra mayúscula, una letra minúscula y un símbolo.</Form.Control.Feedback>}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formClave2">
                <Form.Label>Confirmar Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirmar contraseña"
                  value={usuario.claveConfirm}
                  onChange={(event) => setUsuario({ ...usuario, claveConfirm: event.target.value })}
                  required
                  isInvalid={!claveCoincide}
                />
                {!claveCoincide && <Form.Control.Feedback type="invalid">Las contraseñas no coinciden.</Form.Control.Feedback>}
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formTelefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese teléfono"
                  value={usuario.telefono}
                  onChange={(event) => setUsuario({ ...usuario, telefono: event.target.value })}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3" controlId="formEstado">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  value={usuario.estado ? 'activo' : 'bloqueado'}
                  onChange={(event) => setUsuario({ ...usuario, estado: event.target.value === 'activo' })}
                  required
                >
                  <option value="activo">Activo</option>
                  <option value="bloqueado">Bloqueado</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3" controlId="formDomicilio">
            <Form.Label>Domicilio:</Form.Label>
            <Row>
              <Col>
                <Form.Label>Calle</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese calle"
                  value={usuario.Domicilio.calle}
                  onChange={(event) => setUsuario({ ...usuario, Domicilio: { ...usuario.Domicilio, calle: event.target.value } })}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Label>Número</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingrese número"
                  value={usuario.Domicilio.numero}
                  onChange={(event) => setUsuario({ ...usuario, Domicilio: { ...usuario.Domicilio, numero: parseInt(event.target.value) } })}
                  required
                />
              </Col>
              <Col>
                <Form.Label>Localidad</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese localidad"
                  value={usuario.Domicilio.localidad}
                  onChange={(event) => setUsuario({ ...usuario, Domicilio: { ...usuario.Domicilio, localidad: event.target.value } })}
                  required
                />
              </Col>
            </Row>
          </Form.Group>
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

export default AddEmpleadoModal;
