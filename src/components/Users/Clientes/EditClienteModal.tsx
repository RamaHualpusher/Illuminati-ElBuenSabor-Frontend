import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Col, Row } from "react-bootstrap";
import { IUsuario } from "../../../interface/IUsuario";
import { IRol } from "../../../interface/IRol";

interface IEditClienteModalProps {
  show: boolean;
  handleClose: () => void;
  handleClienteEdit: (cliente: IUsuario) => void;
  selectedCliente: IUsuario | null;
}

const EditClienteModal: React.FC<IEditClienteModalProps> = ({
  show,
  handleClose,
  handleClienteEdit,
  selectedCliente,
}) => {
  // Función para inicializar un nuevo objeto Usuario
  const initializeUsuario = (): IUsuario => {
    return {
      id: 0,
      nombre: "",
      apellido: "",
      email: "",
      clave: "",
      claveConfirm: "",
      telefono: "",
      activo: true,
      domicilio: {
        id: 0,
        calle: "",
        numero: 0,
        localidad: "",
      },
      rol: {
        id: 0,
        nombreRol: "",
      },
    };
  };

  // Estado para gestionar el usuario en el formulario
  const [usuario, setUsuario] = useState<IUsuario>(initializeUsuario());
  const [roles, setRoles] = useState<IRol[]>([]);

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
          <Row>
            <Col md={4}>
              <Col>
                <Form.Group className="mb-3" controlId="formCalle">
                  <Form.Label>Calle</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ingrese calle"
                    value={usuario.domicilio.calle}
                    onChange={(event) =>
                      setUsuario({
                        ...usuario,
                        domicilio: { ...usuario.domicilio, calle: event.target.value },
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
                  value={usuario.domicilio.numero}
                  onChange={(event) =>
                    setUsuario({
                      ...usuario,
                      domicilio: {
                        ...usuario.domicilio,
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
                  value={usuario.domicilio.localidad}
                  onChange={(event) =>
                    setUsuario({
                      ...usuario,
                      domicilio: {
                        ...usuario.domicilio,
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
