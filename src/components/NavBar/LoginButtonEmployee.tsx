import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import LoginFormEmployee from './LoginFormEmployee';

const LoginButtonEmployee: React.FC = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
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
