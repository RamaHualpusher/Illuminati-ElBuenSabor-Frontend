import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { IEditUsuarioFromCliente } from '../../../interface/IUsuario';
import { IEditClienteModalProps } from '../../../interface/IUsuario';

const EditPerfil: React.FC<IEditClienteModalProps> = ({
  show,
  handleClose,
  selectedCliente,
  handleClienteEdit,
}) => {
  const [editedCliente, setEditedCliente] = useState<IEditUsuarioFromCliente>({
    id: 0,
    nombre: '',
    apellido: '',
    email: '',
    clave: '',
    telefono: '',
    domicilio:{
      calle:"",
      numero: 0,
      localidad: ""
    }
  });
  const [confirmarClave, setConfirmarClave] = useState<string>('');
  const [claveError, setClaveError] = useState<string | null>(null);
  const [modificandoClave, setModificandoClave] = useState(false);
  const [claveIngresada, setClaveIngresada] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedCliente((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Verificar la complejidad de la contraseña al modificarla
    if (name === 'clave' && value.trim() !== '' && !modificandoClave) {
      validarComplejidadClave(value);
      setModificandoClave(true);
    }

    // Manejar Confirmar Contraseña si se está modificando la clave
    if (name === 'confirmarClave' && modificandoClave) {
      setConfirmarClave(value);
      if (editedCliente.clave !== value) {
        setClaveError('Las contraseñas no coinciden');
      } else {
        setClaveError(null);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verificar la complejidad de la contraseña al enviar el formulario
    if (modificandoClave) {
      validarComplejidadClave(editedCliente.clave);
    }

    // Verificar la igualdad entre la contraseña y la confirmación de la contraseña
    if (modificandoClave && editedCliente.clave !== confirmarClave) {
      setClaveError('Las contraseñas no coinciden');
      return;
    }

    // Resto de la lógica para guardar los cambios
    handleClienteEdit({
      ...selectedCliente!,
      clave: editedCliente.clave,
      nombre: editedCliente.nombre,
      apellido: editedCliente.apellido,
      email: editedCliente.email,
      // ... otros campos
    });

    // Limpieza de estado después de guardar cambios
    setModificandoClave(false);
    setClaveIngresada(false);
    setEditedCliente({
      id: 0,
      nombre: '',
      apellido: '',
      email: '',
      clave: '',
      telefono: '',
      domicilio:{
        calle:"",
        numero: 0,
        localidad: ""
      }
    });

    handleClose();
  };

  const validarComplejidadClave = (clave: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!regex.test(clave) && clave.length > 0) {
      setClaveError(
        'La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un símbolo.'
      );
    } else {
      setClaveError(null);
      setClaveIngresada(true);
    }
  };

  const handleFieldUpdate = (fieldName: keyof IEditUsuarioFromCliente) => {
    setModificandoClave(fieldName === 'clave');
    setClaveIngresada(false);
    handleClienteEdit({
      ...selectedCliente!,
      clave: editedCliente.clave,
      nombre: editedCliente.nombre,
      apellido: editedCliente.apellido,
      email: editedCliente.email,
      // Puedes añadir otros campos de IEditUsuarioFromCliente si es necesario
    });
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Editar Perfil</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <div style={{ marginBottom: '10px' }}>
            <Form.Group controlId="formNombre">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  type="text"
                  name="nombre"
                  value={editedCliente.nombre}
                  onChange={handleInputChange}
                  style={{ marginLeft: '20px' }}
                />
              </div>
            </Form.Group>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <Form.Group controlId="formApellido">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Label>Apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="apellido"
                  value={editedCliente.apellido}
                  onChange={handleInputChange}
                  style={{ marginLeft: '20px' }}
                />
              </div>
            </Form.Group>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <Form.Group controlId="formEmail">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={editedCliente.email}
                  onChange={handleInputChange}
                  style={{ marginLeft: '20px' }}
                />
              </div>
            </Form.Group>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <Form.Group controlId="formClave">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="clave"
                  value={editedCliente.clave}
                  onChange={handleInputChange}
                  style={{ marginLeft: '20px' }}
                />
                {modificandoClave && claveError && (
                  <div className="text-danger">{claveError}</div>
                )}
              </div>
            </Form.Group>
          </div>
          {modificandoClave && claveIngresada && (
            <div style={{ marginBottom: '10px' }}>
              <Form.Group controlId="formConfirmarClave">
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Form.Label>Confirmar Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmarClave"
                    value={confirmarClave}
                    onChange={handleInputChange}
                    style={{ marginLeft: '20px' }}
                  />
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
          <Button variant="primary" type="submit">
            Guardar Cambios
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditPerfil;
