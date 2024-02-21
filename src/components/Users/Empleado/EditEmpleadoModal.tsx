import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { IRol } from "../../../interface/IRol";
import { IEditUsuarioFromAdmin, IEditEmpleadoModalProps } from "../../../interface/IUsuario";
import axios from "axios";

const EditEmpleadoModal: React.FC<IEditEmpleadoModalProps> = ({
  show,
  handleClose,
  handleEmpleadoEdit,
  selectedEmpleado,
}) => {
  const initializeUsuario = (empleado: IEditUsuarioFromAdmin | null): IEditUsuarioFromAdmin => {
    return empleado || {
      id: 0,
      activo: true,
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",      
      rol: { id: 0, nombreRol: "" },
      domicilio: {
        id: 0,
        calle: "",
        numero: 0,
        localidad: "",
      },
    };
  };

  const [usuario, setUsuario] = useState<IEditUsuarioFromAdmin>(initializeUsuario(selectedEmpleado));
  const [roles, setRoles] = useState<IRol[]>([]);
  const [emailValido, setEmailValido] = useState(true);
  const [emailEnUso, setEmailEnUso] = useState(false);
  const [originalEmail, setOriginalEmail] = useState("");
  const API_URL = process.env.REACT_APP_API_URL || "";
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedEmpleado) {
      setUsuario(selectedEmpleado);
      setOriginalEmail(selectedEmpleado.email);
    }
  }, [selectedEmpleado]);  

  useEffect(() => {
    axios.get(API_URL + "rol")
      .then((response) => {
        setRoles(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleCancelar = () => {
    // Restablecer los valores del estado al valor original del selectedEgresado
    if (selectedEmpleado) {
      setUsuario(initializeUsuario);
    }
    // Restablecer otros estados si es necesario
    setEmailValido(true);
    setEmailEnUso(false);
    setIsSubmitting(false);
    handleClose(); // Cerrar el modal
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Verificar si el correo electrónico ya está en uso
    try {
      const response = await axios.get(API_URL + "usuario/empleados");
      const empleados = response.data;

      if (usuario.email !== originalEmail) {
        const emailExists = empleados.some((empleado: any) => empleado.email === usuario.email);

        if (emailExists) {
          setEmailEnUso(true);
          return;
        } else {
          setEmailEnUso(false);
        }
      }

    } catch (error) {
      console.error("Error al verificar el email:", error);
      return;
    }

    // Verificar dirección de correo electrónico
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(usuario.email)) {
      setEmailValido(false);
      return;
    } else {
      setEmailValido(true);
    }

    setIsSubmitting(true); //Si ya se apreto una vez el boton de editar este se deshabilita
    handleEmpleadoEdit(usuario);
    setUsuario(initializeUsuario);
    setIsSubmitting(false);
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
                  value={usuario.nombre}
                  onChange={(event) => setUsuario({ ...usuario, nombre: event.target.value })}
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
                  value={usuario.apellido}
                  onChange={(event) => 
                    setUsuario({ ...usuario, apellido: event.target.value })}
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
              <Form.Group controlId="formTelefono">
                <Form.Label>Teléfono</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese teléfono"
                  value={usuario.telefono}
                  onChange={(event) => 
                    setUsuario({ ...usuario, telefono: event.target.value })}
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
                  value={usuario.activo ? 'activo' : 'bloqueado'}
                  onChange={(event) => setUsuario({ ...usuario, activo: event.target.value === 'activo' })}
                  required
                >
                  <option value="activo">Activo</option>
                  <option value="bloqueado">Bloqueado</option>
                </Form.Select>
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
          <Form.Group className="mb-3" controlId="formDomicilio">
            <Form.Label>Domicilio:</Form.Label>
            <Row>
              <Col>
                <Form.Label>Calle</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese calle"
                  value={usuario.domicilio.calle || ""}
                  onChange={(event) =>
                    setUsuario({
                      ...usuario,
                      domicilio: {
                        ...usuario.domicilio,
                        calle: event.target.value || "", // Actualizar solo la calle
                      },
                    })
                  }
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
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal >
  );
};

export default EditEmpleadoModal;
