import { useAuth0 } from "@auth0/auth0-react";
import React from 'react';
import { Dropdown, Button } from 'react-bootstrap';

const CustomDropdown = () => {
    const { user } = useAuth0();
  return (
    <Dropdown.Toggle
      variant="link"
      id="dropdown-user"
      as={Button}
      className="nav-link"
    >
      <img
        src={user?.picture}
        alt="imagen usuario"
        className="img-fluid rounded-circle me-2"
        style={{
          width: "50px",
          height: "50px",
        }}
      />
      {user?.name}
      {/* Aquí puedes mostrar el rol del usuario */}
      {user && user.rol && <span>{user.rol}</span>}
    </Dropdown.Toggle>
  );
};

export default CustomDropdown;