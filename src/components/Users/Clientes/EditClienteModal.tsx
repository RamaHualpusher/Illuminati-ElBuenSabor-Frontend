import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { Usuario } from "../../../interface/Usuario";
import { Rol } from "../../../interface/Rol";

interface EditClienteModalProps {
  show: boolean;
  handleClose: () => void;
  handleClienteEdit: (cliente: Usuario) => void;
  selectedCliente: Usuario | null;
}

const EditClienteModal: React.FC<EditClienteModalProps> = ({
  show,
  handleClose,
  handleClienteEdit,
  selectedCliente,
}) => {
  // Función para inicializar un nuevo objeto Usuario
  const initializeUsuario = (): Usuario => {
    return {
      idUsuario: 0,
      nombre: "",
      apellido: "",
      email: "",
      clave: "",
      claveConfirm: "",
      telefono: "",
      estado: true,
      Domicilio: {
        idDomicilio: 0,
        calle: "",
        numero: 0,
        localidad: "",
      },
      Rol: {
        idRol: 0,
        nombreRol: "",
      },
    };
  };

  // Estado para gestionar el usuario en el formulario
  const [usuario, setUsuario] = useState<Usuario>(initializeUsuario());
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
    if (selectedCliente) {
      setUsuario(selectedCliente);
    }
  }, [selectedCliente]);

  // Manejar el envío del formulario
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleClienteEdit(usuario);
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
                  onChange={(event) =>
                    setUsuario({ ...usuario, email: event.target.value })
                  }
                  required
                />
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
                  value={usuario.estado ? "activo" : "bloqueado"}
                  onChange={(event) =>
                    setUsuario({
                      ...usuario,
                      estado: event.target.value === "activo",
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
          <Row>
            <Col md={4}>
              <Col>
                <Form.Group className="mb-3" controlId="formCalle">
                  <Form.Label>Calle</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese calle"
                    value={usuario.Domicilio.calle}
                    onChange={(event) =>
                      setUsuario({
                        ...usuario,
                        Domicilio: { ...usuario.Domicilio, calle: event.target.value },
                      })
                    }
                    required
                  />
                </Form.Group>
              </Col>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formNumero">
                <Form.Label>Número</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ingrese número"
                  value={usuario.Domicilio.numero}
                  onChange={(event) =>
                    setUsuario({
                      ...usuario,
                      Domicilio: {
                        ...usuario.Domicilio,
                        numero: parseInt(event.target.value),
                      },
                    })
                  }
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="formLocalidad">
                <Form.Label>Localidad</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Ingrese localidad"
                  value={usuario.Domicilio.localidad}
                  onChange={(event) =>
                    setUsuario({
                      ...usuario,
                      Domicilio: {
                        ...usuario.Domicilio,
                        localidad: event.target.value,
                      },
                    })
                  }
                  required
                />
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
    </Modal>
  );

};

export default EditClienteModal;
