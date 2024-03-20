import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { IEditUsuarioFromCliente, IEditClienteModalProps } from "../../../interface/IUsuario";
import axios from "axios";

const EditClienteModal: React.FC<IEditClienteModalProps> = ({
  show,
  handleClose,
  handleClienteEdit,
  selectedCliente,
}) => {
  const initializeUsuario = (cliente: IEditUsuarioFromCliente | null): IEditUsuarioFromCliente => {
    return cliente ||{
      id: 0,
      activo: true,
      nombre: "",
      apellido: "",
      email: "",
      clave: "",
      telefono: "",      
      domicilio: {
        id: 0,
        calle: "",
        numero: 0,
        localidad: "",
      }
    };
  };

  // Estado para gestionar el usuario en el formulario
  const [usuario, setUsuario] = useState<IEditUsuarioFromCliente>(initializeUsuario(selectedCliente));
  const [emailValido, setEmailValido] = useState(true);
  const [emailEnUso, setEmailEnUso] = useState(false);
  const [originalEmail, setOriginalEmail] = useState("");
  const API_URL = process.env.REACT_APP_API_URL || "";
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Actualizar campos al seleccionar un cliente
  useEffect(() => {
    if (selectedCliente) {
      setUsuario(selectedCliente);
      setOriginalEmail(selectedCliente.email)
    }
  }, [selectedCliente]);

  const handleCancelar = () => {
    // Restablecer los valores del estado al valor original del selectedEgresado
    if (selectedCliente) {
      setUsuario(initializeUsuario);
    }
    // Restablecer otros estados si es necesario
    setEmailValido(true);
    setEmailEnUso(false);
    setIsSubmitting(false);
    handleClose(); // Cerrar el modal
  }

  // Manejar el envío del formulario
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const response = await axios.get(API_URL + "usuario/clientes");
      const clientes = response.data;

      if (usuario.email !== originalEmail) {
        const emailExists = clientes.some((cliente: any) => cliente.email === usuario.email);

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
    handleClienteEdit(usuario);
    setUsuario(initializeUsuario);
    setIsSubmitting(false);
    handleClose();
  };

return (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Editar Cliente</Modal.Title>
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
                onChange={(event) =>
                  setUsuario({ ...usuario, nombre: event.target.value })
                }
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
                onChange={(event) =>
                  setUsuario({ ...usuario, apellido: event.target.value })
                }
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
            <Form.Group className="mb-3" controlId="formTelefono">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese teléfono"
                value={usuario.telefono}
                onChange={(event) =>
                  setUsuario({ ...usuario, telefono: event.target.value })
                }
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col>
            <Form.Group className="mb-3" controlId="formEstado">
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={usuario.activo ? "activo" : "bloqueado"}
                onChange={(event) =>
                  setUsuario({
                    ...usuario,
                    activo: event.target.value === "activo",
                  })
                }
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
                value={usuario.domicilio?.calle || ""}
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
                value={usuario.domicilio?.numero}
                onChange={(event) => setUsuario({ ...usuario, domicilio: { ...usuario.domicilio, numero: parseInt(event.target.value) } })}
                required
              />
            </Col>
            <Col>
              <Form.Label>Localidad</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese localidad"
                value={usuario.domicilio?.localidad}
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

export default EditClienteModal;
