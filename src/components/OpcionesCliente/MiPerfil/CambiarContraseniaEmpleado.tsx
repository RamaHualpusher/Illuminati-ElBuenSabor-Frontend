// src/components/CambiarContraseña/CambiarContraseña.js
import React, { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import { useUser } from '../../../context/User/UserContext';

interface CambiarContraseniaEmpleadoProps {
    show: boolean;
    handleClose: () => void;
  }

const CambiarContraseniaEmpleado: React.FC<CambiarContraseniaEmpleadoProps> = ({ show, handleClose }) => {
  const { usuarioContext, actualizarUsuarioContext } = useUser();
  const [clave, setClave] = useState('');
  const [confirmarClave, setConfirmarClave] = useState('');
  const [claveError, setClaveError] = useState('');

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

    if(usuarioContext){
        try {
        const API_URL = process.env.REACT_APP_API_URL || '';
        await axios.put(`${API_URL}usuario/${usuarioContext.id}/cambiarClave`, { clave });
        handleClose();
        await actualizarUsuarioContext();
        } catch (error) {
        setClaveError('Hubo un error al cambiar la contraseña.');
        console.error(error);
        }
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Bienvenido {usuarioContext?.nombre}, es necesario que cambies tu contraseña.</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group controlId="formClave">
            <Form.Label>Nueva Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="clave"
              value={clave}
              onChange={handleInputChange}
              isInvalid={!!claveError}
            />
            <Form.Control.Feedback type="invalid">{claveError}</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formConfirmarClave">
            <Form.Label>Confirmar Contraseña</Form.Label>
            <Form.Control
              type="password"
              name="confirmarClave"
              value={confirmarClave}
              onChange={handleInputChange}
              isInvalid={!!claveError}
            />
            <Form.Control.Feedback type="invalid">{claveError}</Form.Control.Feedback>
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
  );
};

export default CambiarContraseniaEmpleado;
