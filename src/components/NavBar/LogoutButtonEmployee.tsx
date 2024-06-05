import React from 'react';
import { Button } from 'react-bootstrap';

const LogoutButtonEmployee: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('employeeToken');
    window.location.reload();
  };

  return (
    <Button variant="danger" onClick={handleLogout}>
      Cerrar sesión
    </Button>
  );
};

export default LogoutButtonEmployee;
