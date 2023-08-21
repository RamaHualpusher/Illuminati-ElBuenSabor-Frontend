import React from "react";
import AdminPage from "../components/AdminPage/AdminPage";
import NavBar from "../components/NavBar/AdminBar";

const Admin = () => {
  return (
    <div className="d-flex" style={{ /* Estilos para un diseño flexible */
      width: "100%",
      height: "100vh", // Altura del 100% de la ventana visible
    }}>
      {/* Barra de navegación específica para el administrador */}
      <NavBar />

      <div className="flex-grow-1">
        {/* Contenido principal de la página de administrador */}
        <AdminPage />
      </div>
    </div>
  );
};

export default Admin;
