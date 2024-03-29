import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { IRol } from "../../../interface/IRol";
import { IUsuario } from "../../../interface/IUsuario";
import { IAddEmpleadoModalProps } from "../../../interface/IUsuario";
import axios from "axios";
const bcrypt = require('bcryptjs');

const AddEmpleadoModal: React.FC<IAddEmpleadoModalProps> = ({
  show,
  handleClose,
  handleEmpleadoAdd,
}) => {
  // Función para inicializar un nuevo objeto Usuario
  const initializeNewUsuario = (): IUsuario => {
    return {
      id: 0,
      nombre: "",
      apellido: "",
      email: "",
      clave: "",
      claveConfirm: "",
      telefono: "",
      activo: true,
      rol: { id: 0, nombreRol: "" },
      domicilio: {
        id: 0,
        activo: true,
        calle: "",
        numero: 0,
        localidad: "",
      },
    };
  };

  const [usuario, setUsuario] = useState<IUsuario>(initializeNewUsuario);
  const [roles, setRoles] = useState<IRol[]>([]);
  const [claveCoincide, setClaveCoincide] = useState(true);
  const [claveValida, setClaveValida] = useState(true);
  const [emailValido, setEmailValido] = useState(true);
  const [emailEnUso, setEmailEnUso] = useState(false);
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const API_URL = process.env.REACT_APP_API_URL || "";
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });


  // Cargar roles al montar el componente
  useEffect(() => {
    fetch(API_URL + "rol")
      .then((response) => response.json())
      .then((data) => {
        setRoles(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Función para verificar la contraseña en tiempo real
  const checkPassword = (password: string) => {
    setPasswordValidation({
      length: password.length >= 8,
      lowercase: /[a-z]/.test(password),
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[-_@$!%*?&]/.test(password),
    });
  };

  useEffect(() => {
    checkPassword(usuario.clave);
  }, [usuario.clave]);

  const handleCancelar = () => {
    setUsuario(initializeNewUsuario);
    setIsSubmitting(false);
    handleClose();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Verificar si el email ya está en uso
    try {
      const response = await axios.get(API_URL + "usuario/empleados");
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

    // Verificar las condiciones de la contraseña
    const isPasswordValid =
      passwordValidation.length &&
      passwordValidation.lowercase &&
      passwordValidation.uppercase &&
      passwordValidation.number &&
      passwordValidation.specialChar;

    if (!isPasswordValid) {
      // Si la contraseña no cumple con las condiciones, puedes mostrar un mensaje o realizar alguna acción
      setClaveValida(false);
      console.error("La contraseña no cumple con los requisitos.");
      return;
    }

    // Encriptar la contraseña antes de enviarla al servidor
    const saltRounds = 10; // Puedes ajustar el número de rondas según tus necesidades
    const hashedPassword = await bcrypt.hash(usuario.clave, saltRounds);
    // Ahora `hashedPassword` contiene la contraseña encriptada
    usuario.clave = hashedPassword;//Se le asigna la clave encriptada al usuario
    console.log()
    if (usuario.domicilio.activo) {
      setIsSubmitting(true); //Si ya se apreto una vez el boton de agregar este se deshabilita
      handleEmpleadoAdd(usuario);
      setUsuario(initializeNewUsuario);
      setIsSubmitting(false);
      handleClose();
    }

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
                  value={usuario.rol.id || ""}
                  onChange={(event) => {
                    const selectedIdRol = parseInt(event.target.value);
                    const selectedRol = roles.find((rol) => rol.id === selectedIdRol) || { idRol: 0, nombreRol: "" };
                    setUsuario((prevUsuario) => ({ ...prevUsuario, rol: selectedRol }));
                  }}
                  required
                >
                  <option value="">Seleccione un rol</option>
                  {roles.map((rol) => (
                    <option key={rol.id} value={rol.id}>
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
            <Row>
              <Col md="6">
                {usuario.clave && (
                  <div className="card border-info shadow">
                    <ul className="list-unstyled">
                      <li className={`password-validation-item ${passwordValidation.length ? 'text-success' : 'text-danger'}`}>
                        {passwordValidation.length ? <i className="bi bi-check"></i> : <i className="bi bi-x"></i>}
                        Al menos 8 caracteres de largo
                      </li>
                      <li className={`password-validation-item ${passwordValidation.lowercase ? 'text-success' : 'text-danger'}`}>
                        {passwordValidation.lowercase ? <i className="bi bi-check"></i> : <i className="bi bi-x"></i>}
                        Letras minúsculas (a-z)
                      </li>
                      <li className={`password-validation-item ${passwordValidation.uppercase ? 'text-success' : 'text-danger'}`}>
                        {passwordValidation.uppercase ? <i className="bi bi-check"></i> : <i className="bi bi-x"></i>}
                        Letras mayúsculas (A-Z)
                      </li>
                      <li className={`password-validation-item ${passwordValidation.number ? 'text-success' : 'text-danger'}`}>
                        {passwordValidation.number ? <i className="bi bi-check"></i> : <i className="bi bi-x"></i>}
                        Números (0-9)
                      </li>
                      <li className={`password-validation-item ${passwordValidation.specialChar ? 'text-success' : 'text-danger'}`}>
                        {passwordValidation.specialChar ? <i className="bi bi-check"></i> : <i className="bi bi-x"></i>}
                        Caracteres especiales <br /> (por ejemplo: -_@$!%*?&)
                      </li>
                    </ul>
                  </div>
                )}
              </Col>
            </Row>
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
                  value={usuario.activo ? 'activo' : 'bloqueado'}
                  onChange={(event) => setUsuario({ ...usuario, activo: event.target.value === 'activo' })}
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
                  value={usuario.domicilio.calle}
                  onChange={(event) => setUsuario({ ...usuario, domicilio: { ...usuario.domicilio, calle: event.target.value, activo: true, } })}
                  required
                />
              </Col>
              <Col md={3}>
                <Form.Label>Número</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingrese número"
                  value={usuario.domicilio.numero}
                  onChange={(event) => setUsuario({ ...usuario, domicilio: { ...usuario.domicilio, numero: parseInt(event.target.value) } })}
                  required
                />
              </Col>
              <Col>
                <Form.Label>Localidad</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese localidad"
                  value={usuario.domicilio.localidad}
                  onChange={(event) => setUsuario({ ...usuario, domicilio: { ...usuario.domicilio, localidad: event.target.value } })}
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
          <Button variant="primary" type="submit" disabled={isSubmitting}>
            Agregar
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default AddEmpleadoModal;
