import React, { useState } from "react";

// Propiedades para el componente de la barra de navegación del panel de administración
interface NavbarAdminProps {
  title: string; // Título que se mostrará en la barra de navegación
}

// Componente funcional para la barra de navegación del panel de administración
const PanelAdmin: React.FC<NavbarAdminProps> = ({ title }) => {
  // Estado para controlar el estado abierto/cerrado de la barra de navegación
  const [navbarOpen, setNavbarOpen] = useState(false);

  // Función para alternar el estado abierto/cerrado de la barra de navegación
  const toggleNavbar = () => {
    setNavbarOpen(!navbarOpen);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark" style={{ marginTop: "60px" }}>
      <div className="container" style={{ display: "flex", justifyContent: "center" }}>
        {/* Título del panel de administración */}
        <h1 className="display-4 text-white">{title}</h1>
      </div>
    </nav>
  );
};

export default PanelAdmin;
