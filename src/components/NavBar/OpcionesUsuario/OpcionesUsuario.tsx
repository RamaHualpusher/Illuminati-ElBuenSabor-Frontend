import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const OpcionesUsuario = () => {
  return (
    <Dropdown.Menu>
      <Dropdown.Item as={Link} to="/mi-direccion">
        <i className="bi bi-geo-alt me-2"></i>Mi dirección
      </Dropdown.Item>
      <Dropdown.Item as={Link} to="/mis-pedidos">
        <i className="bi bi-journals me-2"></i>Mis pedidos
      </Dropdown.Item>
      <Dropdown.Item as={Link} to="/perfil">
        <i className="bi bi-person-square me-2"></i>Mi perfil
      </Dropdown.Item>
    </Dropdown.Menu>
  );
};

export default OpcionesUsuario;
