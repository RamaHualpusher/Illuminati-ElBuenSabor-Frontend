import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import LoginFormEmployee from './LoginFormEmployee';
import { useUser } from '../../context/User/UserContext';

const LoginButtonEmployee: React.FC = () => {
  const [show, setShow] = useState(false);
  const { usuarioContext, loading, userExists } = useUser(); // Obtiene el contexto del usuario
  const navigate = useNavigate(); // Obtiene la función navigate
  const [isMounted, setIsMounted] = useState(true);

  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  useEffect(() => {
    if (isMounted && !loading && userExists && usuarioContext) {
      switch (usuarioContext.rol.nombreRol) {
        case 'Admin':
          navigate('/admin');
          break;
        case 'Cajero':
          navigate('/cajero');
          break;
        case 'Cocinero':
          navigate('/cocinero');
          break;
        case 'Delivery':
          navigate('/delivery');
          break;
        default:
          break;
      }

      if (usuarioContext.rol.nombreRol !== 'Admin' && usuarioContext.primerIngreso) {
        navigate('/perfil');
        window.alert('Tienes que cambiar tu contraseña');
      }
    }
  }, [isMounted, loading, userExists, usuarioContext, navigate]);

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow} className="me-2">
        Iniciar sesión
      </Button>

      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Inicio de Sesión Empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <LoginFormEmployee onLoginSuccess={handleClose} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginButtonEmployee;
