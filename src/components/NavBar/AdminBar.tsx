import React, { FC, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import BackButton from "../BackButtom/BackButtom"; //Arreglen su BackButtom, Pongan la B mayuscula no va con b.
import { Button, Dropdown } from "react-bootstrap";
import CustomDropdown from "./CustomDropdown/CustomDropdown";
import OpcionesUsuario from "./OpcionesUsuario/OpcionesUsuario";
import LoginButtonEmployee from "./LoginButtonEmployee";
import { Link } from "react-router-dom";
import LogoutButtonEmployee from "./LogoutButtonEmployee";

/**
 * Barra de navegación para el administrador.
 */
const AdminBar: FC = () => {
  // Obtener el estado de autenticación y usuario del contexto de Auth0
  const { isAuthenticated, user } = useAuth0();

  // Estado para controlar la apertura/cierre del menú desplegable
  const [navbarOpen, setNavbarOpen] = useState(false);

  const employeeToken = localStorage.getItem("employeeToken");

  // Función para alternar la visibilidad del menú desplegable
  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  // Función para obtener el primer nombre de un nombre completo
  const getFirstName = (fullName: string) => {
    return fullName.split(" ")[0];
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top"
      style={{ height: "4rem" }}
    >
      <div className="container">
        <BackButton />
        <div className="d-flex align-items-center">
          <a
            href="/"
            className="logo-iluminatti-1 me-2"
            style={{ marginLeft: "30px" }}
          >
            <img
              className="logo-iluminatti-1 me-2"
              src="/assets/img/logo-grupo-illuminati.jpg"
              alt="logo"
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
              }}
            />
          </a>
          <a className="navbar-brand" href="/">
            El Buen Sabor - Illuminati
          </a>
        </div>

        {/* Botón de hamburguesa para el menú desplegable */}
        <button className="navbar-toggler" type="button" onClick={toggleNavbar}>
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* Menú desplegable */}
        <div
          className={`collapse navbar-collapse justify-content-end ${
            navbarOpen ? "show" : ""
          }`}
        >
          <ul className="navbar-nav align-items-center">
            {/* Mostrar información del usuario autenticado */}
            {isAuthenticated ||
              (employeeToken && (
                <>
                  <li className="nav-item d-flex align-items-center mx-2">
                    <Dropdown>
                      <CustomDropdown employeeToken={employeeToken} />
                      <OpcionesUsuario />
                    </Dropdown>
                  </li>
                </>
              ))}
            {/* Mostrar botón de inicio de sesión o cierre de sesión según el estado de autenticación */}
            {isAuthenticated || employeeToken && (
              <li>
                <Link to="/">
                  <Button className="btn btn-secondary">
                    {" "}
                    <i className="bi bi-house-door me-2"></i>Home
                  </Button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminBar;
