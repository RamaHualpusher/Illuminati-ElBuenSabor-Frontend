import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { IEditUsuarioFromCliente } from "../../../interface/IUsuario";
import { IEditClienteModalProps } from "../../../interface/IUsuario";

const EditPerfil: React.FC<IEditClienteModalProps> = ({
  show,
  handleClose,
  selectedUsuario,
  handleClienteEdit,
}) => {
  const [editedCliente, setEditedCliente] = useState<IEditUsuarioFromCliente>({
    id: 0,
    nombre: "",
    apellido: "",
    email: "",
    clave: "",
    telefono: "",
    domicilio: {
      calle: "",
      numero: 0,
      localidad: "",
    },
  });
  const [confirmarClave, setConfirmarClave] = useState<string>("");
  const [claveError, setClaveError] = useState<string | null>(null);
  const [modificandoClave, setModificandoClave] = useState(false);
  const [claveIngresada, setClaveIngresada] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || "";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  useEffect(() => {
    if (selectedUsuario) {
      setEditedCliente({
        id: selectedUsuario.id,
        nombre: selectedUsuario.nombre,
        apellido: selectedUsuario.apellido,
        email: selectedUsuario.email,
        clave: selectedUsuario?.clave || "",
        telefono: selectedUsuario?.telefono,
        domicilio: selectedUsuario.domicilio,
      });
    }
  }, [selectedUsuario]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCliente((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Verificar la complejidad de la contraseña al modificarla
    if (name === "clave" && value.trim() !== "" && !modificandoClave) {
      validarComplejidadClave(value);
      setModificandoClave(true);
    }

    // Manejar Confirmar Contraseña si se está modificando la clave
    if (name === "confirmarClave" && modificandoClave) {
      setConfirmarClave(value);
      if (editedCliente.clave !== value) {
        setClaveError("Las contraseñas no coinciden");
      } else {
        setClaveError(null);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verificar la complejidad de la contraseña al enviar el formulario
    if (modificandoClave) {
      validarComplejidadClave(editedCliente.clave);
    }

    // Verificar la igualdad entre la contraseña y la confirmación de la contraseña
    if (modificandoClave && editedCliente.clave !== confirmarClave) {
      setClaveError("Las contraseñas no coinciden");
      return;
    }

    const clienteAEnviar = {
      ...selectedUsuario!,
      nombre: editedCliente.nombre,
      apellido: editedCliente.apellido,
      email: editedCliente.email,
      telefono: editedCliente.telefono,
      domicilio: editedCliente.domicilio,
      clave: editedCliente.clave,
    };

    try {
      const response = await fetch(`${API_URL}usuario/${clienteAEnviar?.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clienteAEnviar),
      });

      if (!response.ok) {
        throw new Error("Error al guardar los cambios");
      }

      const data = await response.json();
      handleClienteEdit(data);
      handleClose();
    } catch (error) {
      console.error(error);
      setClaveError("Hubo un error al guardar los cambios.");
    }

    // Limpieza de estado después de guardar cambios
    setModificandoClave(false);
    setClaveIngresada(false);
    setEditedCliente({
      id: 0,
      nombre: "",
      apellido: "",
      email: "",
      clave: "",
      telefono: "",
      domicilio: {
        calle: "",
        numero: 0,
        localidad: "",
      },
    });

    handleClose();
  };

  const validarComplejidadClave = (clave: string) => {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!regex.test(clave) && clave.length > 0) {
      setClaveError(
        "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un símbolo."
      );
    } else {
      setClaveError(null);
      setClaveIngresada(true);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Perfil</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div style={{ marginBottom: "10px", textAlign: "right" }}>
            <Form.Group controlId="formNombre">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Form.Label style={{ width: "150px", textAlign: "left" }}>
                  Nombre
                </Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={editedCliente.nombre}
                  onChange={handleInputChange}
                  style={{ marginLeft: "20px" }}
                  className="shadow-sm"
                />
              </div>
            </Form.Group>
          </div>
          <div style={{ marginBottom: "10px", textAlign: "right" }}>
            <Form.Group controlId="formApellido">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Form.Label style={{ width: "150px", textAlign: "left" }}>
                  Apellido
                </Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={editedCliente.apellido}
                  onChange={handleInputChange}
                  style={{ marginLeft: "20px" }}
                  className="shadow-sm"
                />
              </div>
            </Form.Group>
          </div>
          <div style={{ marginBottom: "10px", textAlign: "right" }}>
            <Form.Group controlId="formEmail">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Form.Label style={{ width: "150px", textAlign: "left" }}>
                  Email
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editedCliente.email}
                  onChange={handleInputChange}
                  style={{ marginLeft: "20px" }}
                  className="shadow-sm"
                />
              </div>
            </Form.Group>
          </div>
          <div style={{ marginBottom: "10px", textAlign: "right" }}>
            <Form.Group controlId="formTelefono">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Form.Label style={{ width: "150px", textAlign: "left" }}>
                  Telefono
                </Form.Label>
                <Form.Control
                  type="number"
                  name="telefono"
                  value={editedCliente.telefono}
                  onChange={handleInputChange}
                  style={{ marginLeft: "20px" }}
                  className="shadow-sm"
                />
              </div>
            </Form.Group>
          </div>
          <div style={{ marginBottom: "10px", textAlign: "right" }}>
            <Form.Group controlId="formClave">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Form.Label style={{ width: "100px", textAlign: "left" }}>
                  Contraseña
                </Form.Label>
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="clave"
                  value={editedCliente.clave}
                  onChange={handleInputChange}
                  style={{ marginLeft: "45px"}}
                  className="shadow-sm"
                />
                <Button
                  onClick={() => setShowPassword(!showPassword)}
                  variant="outline-secondary"
                  style={{ marginLeft: "5px" }}
                >
                  {showPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye-fill"></i>}
                </Button>
              </div>
            </Form.Group>
            {modificandoClave && claveError && (
              <div className="text-danger p-1">{claveError}</div>
            )}
          </div>
          {editedCliente.clave.trim() === "" && ( // Verifica si la contraseña está vacía
            <div className="text-danger mt-2">
              Por favor, ingrese una contraseña.
            </div>
          )}
          {modificandoClave && (
            <div style={{ marginBottom: "10px", textAlign: "right" }}>
              <Form.Group controlId="formConfirmarClave">
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Form.Label style={{ width: "150px", textAlign: "left" }}>
                    Confirmar Contraseña
                  </Form.Label>
                  <Form.Control
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmarClave"
                    value={confirmarClave}
                    onChange={handleInputChange}
                    style={{ marginLeft: "35px" }}
                  />
                  <Button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    variant="outline-secondary"
                    style={{ marginLeft: "5" }}
                  >
                    {showConfirmPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye-fill"></i>}
                  </Button>
                </div>
                {claveError && <div className="text-danger">{claveError}</div>}
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={editedCliente.clave.trim() === ""}
          >
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditPerfil;
