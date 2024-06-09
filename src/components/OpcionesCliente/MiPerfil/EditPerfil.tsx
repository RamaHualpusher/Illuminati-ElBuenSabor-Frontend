import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { IEditUsuarioFromCliente } from "../../../interface/IUsuario";
import { IEditClienteModalProps } from "../../../interface/IUsuario";
import { useUser } from "../../../context/User/UserContext";

const EditPerfil: React.FC<IEditClienteModalProps> = ({
  show,
  handleClose,
  selectedUsuario,
  handleClienteEdit,
}) => {
  const { usuarioContext } = useUser();
  const [editedCliente, setEditedCliente] = useState<IEditUsuarioFromCliente>({
    id: 0,
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    domicilio: {
      calle: "",
      numero: 0,
      localidad: "",
    },
    clave: "", // Inicializar clave
  });
  const [confirmarClave, setConfirmarClave] = useState<string>("");
  const [claveError, setClaveError] = useState<string | null>(null);
  const [modificandoClave, setModificandoClave] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL || "";

  useEffect(() => {
    if (selectedUsuario) {
      setEditedCliente({
        id: selectedUsuario.id,
        nombre: selectedUsuario.nombre,
        apellido: selectedUsuario.apellido,
        email: selectedUsuario.email,
        telefono: selectedUsuario.telefono,
        domicilio: selectedUsuario.domicilio,
        clave: "", // Establecer clave vacía cuando se selecciona un usuario
      });
    }
  }, [selectedUsuario]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCliente((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "clave" && modificandoClave) {
      validarComplejidadClave(value);
    }

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

    if (modificandoClave) {
      validarComplejidadClave(editedCliente.clave);
    }

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
      clave: modificandoClave ? editedCliente.clave : "",
    };

    // try {
    //   const response = await fetch(`${API_URL}usuario/${clienteAEnviar?.id}`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(clienteAEnviar),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Error al guardar los cambios");
    //   }

    //   const data = await response.json();
    //   handleClienteEdit(data);
    //   handleClose();
    // } catch (error) {
    //   console.error(error);
    //   setClaveError("Hubo un error al guardar los cambios.");
    // }"clave": "$2a$10$2jjfZKqLwLsoZ7Vl95e2geNld3E7HUSJPUSvWEZnwtzfsBSdocQm2",
    handleClienteEdit(clienteAEnviar);
    setModificandoClave(false);
    setEditedCliente({
      id: 0,
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      domicilio: {
        calle: "",
        numero: 0,
        localidad: "",
      },
      clave: "", // Reiniciar clave
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
    }
  };

  return (
    <Modal show={show} onHide={handleClose} size="xl" style={{ fontSize: "1.2rem" }}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Perfil</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div style={{ marginBottom: "10px", textAlign: "right" }}>
            <Form.Group controlId="formNombre">
              <div style={{ display: "flex", alignItems: "center" }}>
                <Form.Label style={{ width: "150px", textAlign: "left" }}>Nombre</Form.Label>
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
                <Form.Label style={{ width: "150px", textAlign: "left" }}>Apellido</Form.Label>
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
                <Form.Label style={{ width: "150px", textAlign: "left" }}>Email</Form.Label>
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
                <Form.Label style={{ width: "150px", textAlign: "left" }}>Telefono</Form.Label>
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
          {usuarioContext && usuarioContext.rol.nombreRol !== "Cliente" && (
            <div style={{ marginBottom: "10px", textAlign: "right" }}>
              {!modificandoClave ? (
                <Button onClick={() => setModificandoClave(true)}>
                  Cambiar Contraseña
                </Button>
              ) : (
                <>
                  <div style={{ marginBottom: "10px", textAlign: "right" }}>
                    <Form.Group controlId="formClave">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Form.Label style={{ width: "150px", textAlign: "left" }}>Nueva Contraseña</Form.Label>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="clave"
                          value={editedCliente.clave}
                          onChange={handleInputChange}
                          style={{ marginLeft: "20px" }}
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
                    {claveError && <div className="text-danger p-1">{claveError}</div>}
                  </div>
                  <div style={{ marginBottom: "10px", textAlign: "right" }}>
                    <Form.Group controlId="formConfirmarClave">
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Form.Label style={{ width: "150px", textAlign: "left" }}>Confirmar Contraseña</Form.Label>
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmarClave"
                          value={confirmarClave}
                          onChange={handleInputChange}
                          style={{ marginLeft: "20px" }}
                          className="shadow-sm"
                        />
                        <Button
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          variant="outline-secondary"
                          style={{ marginLeft: "5px" }}
                        >
                          {showConfirmPassword ? <i className="bi bi-eye-slash"></i> : <i className="bi bi-eye-fill"></i>}
                        </Button>
                      </div>
                    </Form.Group>
                    {claveError && <div className="text-danger p-1">{claveError}</div>}
                  </div>
                </>
              )}
            </div>
          )}
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

export default EditPerfil;
