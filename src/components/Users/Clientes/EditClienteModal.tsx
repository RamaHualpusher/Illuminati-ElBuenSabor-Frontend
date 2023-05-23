import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Usuario } from "../../../interface/Usuario";
import { Rol } from "../../../interface/Rol";
import { Domicilio } from "../../../interface/Domicilio";

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
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [rolId, setRolId] = useState<number | null>(null);
  const [roles, setRoles] = useState<Rol[]>([]);
  const [domicilio, setDomicilio] = useState<Domicilio>({
    idDomicilio: 0,
    calle: "",
    numero: 0,
    localidad: "",
  });

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
    if (selectedCliente) {
      setNombre(selectedCliente.nombre);
      setApellido(selectedCliente.apellido);
      setEmail(selectedCliente.email);
      setTelefono(selectedCliente.telefono);
      setRolId(selectedCliente.Rol.idRol);
      setDomicilio(selectedCliente.Domicilio);
    }
  }, [selectedCliente]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedCliente) {
      const selectedRol = roles.find((rol) => rol.idRol === rolId);
      const updatedCliente: Usuario = {
        ...selectedCliente,
        nombre,
        apellido,
        email,
        telefono,
        Rol: selectedRol !== undefined ? selectedRol : selectedCliente.Rol,
        Domicilio: domicilio,
      };
      handleClienteEdit(updatedCliente);
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Cliente</Modal.Title>
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
          <Form.Group className="mb-3" controlId="formCalle">
            <Form.Label>Calle</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese calle"
              value={domicilio.calle}
              onChange={(event) =>
                setDomicilio({ ...domicilio, calle: event.target.value })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formNumero">
            <Form.Label>Número</Form.Label>
            <Form.Control
              type="number"
              placeholder="Ingrese número"
              value={domicilio.numero}
              onChange={(event) =>
                setDomicilio({
                  ...domicilio,
                  numero: parseInt(event.target.value),
                })
              }
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formLocalidad">
            <Form.Label>Localidad</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ingrese localidad"
              value={domicilio.localidad}
              onChange={(event) =>
                setDomicilio({ ...domicilio, localidad: event.target.value })
              }
              required
            />
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

export default EditClienteModal;
