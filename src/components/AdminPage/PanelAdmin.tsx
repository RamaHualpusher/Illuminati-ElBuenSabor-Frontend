import React, { useState } from "react";

interface NavbarAdminProps {
  title: string;
}

const PanelAdmin: React.FC<NavbarAdminProps> = ({ title }) => {
  const [navbarOpen, setNavbarOpen] = useState(false);

  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <div className="d-flex justify-content-center align-items-center">
          <button className="btn btn-primary me-2">Perfil</button>
          <button className="btn btn-primary me-2">Empleados</button>
          <button className="btn btn-primary me-2">Usuarios</button>
          <button className="btn btn-primary me-2">Facturas</button>
          <button className="btn btn-primary me-2">Stock</button>
        </div>
        <h1 className="Title_admin h1 text-white">{title}</h1>
      </div>
    </nav>
  );
};

export default PanelAdmin;
