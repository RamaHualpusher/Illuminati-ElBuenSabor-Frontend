import React from "react";
import { Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../../context/User/UserContext";

interface OpcionesUsuarioProps {
  employeeToken: string | null; // Define el tipo de employeeToken
}

const OpcionesUsuario: React.FC<OpcionesUsuarioProps> = ({ employeeToken }) => {
  const navigate = useNavigate();
  const { usuarioContext } = useUser();

  const handleWorkButtonClick = () => {
    if (usuarioContext) {
      switch (usuarioContext.rol.nombreRol) {
        case "Admin":
          navigate("/admin");
          break;
        case "Cajero":
          navigate("/cajero");
          break;
        case "Cocinero":
          navigate("/cocinero");
          break;
        case "Delivery":
          navigate("/delivery");
          break;
        default:
          break;
      }
    }
  };

  return (
    <Dropdown.Menu>
      <Dropdown.Item as={Link} to="/mi-direccion">
        <i className="bi bi-geo-alt me-2"></i>Mi dirección
      </Dropdown.Item>
      <Dropdown.Item as={Link} to="/mis-pedidos">
        <i className="bi bi-journals me-2"></i>Mis pedidos
      </Dropdown.Item>
      <Dropdown.Item as={Link} to="/perfil">
        <i className="bi bi bi-person-circle me-2"></i>Mi perfil
      </Dropdown.Item>
      {employeeToken && ( // Condición para mostrar la opción adicional si hay un employeeToken
        <Dropdown.Item onClick={handleWorkButtonClick}>
          <i className="bi bi-person-workspace me-2"></i>Trabajo
        </Dropdown.Item>
      )}
      
    </Dropdown.Menu>
  );
};

export default OpcionesUsuario;
