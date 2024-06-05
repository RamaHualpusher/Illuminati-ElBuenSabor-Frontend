import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import LoginFormEmployee from './LoginFormEmployee';

const LoginButtonEmployee: React.FC = () => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Iniciar sesión como empleado
      </Button>

      <Modal show={show} onHide={handleClose} size="xl" style={{padding:"50px" }}>
        <Modal.Header closeButton style={{padding:"50px" }}>
          <Modal.Title>Inicio de Sesión Empleado</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{padding:"50px" }}>
          <LoginFormEmployee onLoginSuccess={handleClose} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default LoginButtonEmployee;
