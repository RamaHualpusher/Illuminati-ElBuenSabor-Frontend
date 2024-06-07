import React from "react";
import { Dropdown, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from "../../../context/User/UserContext";

interface CustomDropdownProps {
  employeeToken: string | null; // Define el tipo de employeeToken
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ employeeToken }) => {
  const { user } = useAuth0();
  const { usuarioContext } = useUser();
  // Función para obtener las iniciales del usuario
  const getInitials = (name: any) => {
    return name
      .split(" ")
      .map((word: any[]) => word[0])
      .join("")
      .toUpperCase();
  };

  // Determinar si mostrar la imagen o las iniciales
  const renderContent = () => {
    if (user?.picture) {
      // Si hay una imagen disponible, mostrarla
      return (
        <img
          src={user.picture}
          alt={getInitials(user?.name || "")}
          className="img-fluid rounded-circle me-2"
          style={{
            width: "50px",
            height: "50px",
          }}
        />
      );
    } else {
      // Si no hay imagen, mostrar las iniciales
      return (
        <div
          className="img-fluid rounded-circle me-2 d-flex align-items-center justify-content-center"
          style={{
            width: "50px",
            height: "50px",
            backgroundColor: "#C0C0C0", // Color de fondo para las iniciales
          }}
        >
          <span
            style={{ fontSize: "20px", fontWeight: "bold" }}
            className="text-black"
          >
            {getInitials(usuarioContext?.nombre || "")}
          </span>
        </div>
      );
    }
  };

  return (
    <Dropdown.Toggle
      variant="link"
      id="dropdown-user"
      as={Button}
      className="nav-link d-flex align-items-center"
      style={{ gap: "10px" }} // Añadimos espacio entre la imagen/iniciales y el nombre y apellido
    >
      {renderContent()}
      {employeeToken ? (
        <>
          <span>{usuarioContext?.rol.nombreRol}</span> -
          <span>{`${usuarioContext?.nombre} ${usuarioContext?.apellido}`}</span>
        </>
      ) : (
        <>
          <span>{user?.name}</span>
          {user && user.rol && <span>{user.rol}</span>}
        </>
      )}
    </Dropdown.Toggle>
  );
};

export default CustomDropdown;
