import React, { useState } from 'react';
import { Button, Form, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../../../context/User/UserContext';
import { BiShow, BiHide } from "react-icons/bi";

interface CambiarContraseniaEmpleadoProps {
  show: boolean;
  handleClose: () => void;
}

const CambiarContraseniaEmpleado: React.FC<CambiarContraseniaEmpleadoProps> = ({ show, handleClose }) => {
  const { usuarioContext, actualizarUsuarioContext } = useUser();
  const [clave, setClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [claveError, setClaveError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);

  const validarComplejidadClave = (clave: string) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(clave);
  };

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    if (name === 'clave') {
      setClave(value);
      if (!validarComplejidadClave(value)) {
        setClaveError('La contraseña debe tener al menos 8 caracteres, una letra mayúscula, una letra minúscula y un símbolo.');
      } else {
        setClaveError('');
      }
    }
    if (name === 'confirmarClave') {
      setConfirmarClave(value);
      if (value !== clave) {
        setClaveError('Las contraseñas no coinciden.');
      } else {
        setClaveError('');
      }
    }
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (!validarComplejidadClave(clave) || clave !== confirmarClave) {
      setClaveError('Las contraseñas no coinciden o no cumplen con los requisitos.');
      return;
    }

    if (usuarioContext) {
      try {
        const API_URL = process.env.REACT_APP_API_URL || '';
        const updatedUsuario = {
          ...usuarioContext,
          clave,
          primerIngreso: false,
        };

        const response = await axios.put(`${API_URL}usuario/actualizar/${usuarioContext.id}`, updatedUsuario);
        
        if (response.data) {
          setAlertVisible(true);
          setTimeout(() => {
            setAlertVisible(false);
            handleClose();
          }, 3000);
        }
      } catch (error) {
        setClaveError('Hubo un error al cambiar la contraseña.');
        console.error(error);
      }
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Bienvenido {usuarioContext?.nombre}, es necesario que cambies tu contraseña.</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {alertVisible && <Alert variant="success">Contraseña cambiada con éxito.</Alert>}
            <Form.Group controlId="formClave">
              <Form.Label>Nueva Contraseña</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  name="clave"
                  value={clave}
                  onChange={handleInputChange}
                  isInvalid={!!claveError}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <BiHide /> : <BiShow />}
                </Button>
                <Form.Control.Feedback type="invalid">{claveError}</Form.Control.Feedback>
              </div>
            </Form.Group>
            <Form.Group controlId="formConfirmarClave">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmarClave"
                  value={confirmarClave}
                  onChange={handleInputChange}
                  isInvalid={!!claveError}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <BiHide /> : <BiShow />}
                </Button>
                <Form.Control.Feedback type="invalid">{claveError}</Form.Control.Feedback>
              </div>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Cambiar Contraseña
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default CambiarContraseniaEmpleado;
