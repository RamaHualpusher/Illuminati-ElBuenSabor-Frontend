
import React, { useEffect, useState } from "react";
import { useUser } from "../context/User/UserContext";
import NavBar from "../components/NavBar/AdminBar";
import CocineroPage from "../components/CocineroPage/CocineroPage";
import PanelAdmin from "../components/AdminPage/PanelAdmin";
import CambiarContraseniaEmpleado from "../components/OpcionesCliente/MiPerfil/CambiarContraseniaEmpleado";

const Cocinero = () => {
  const { usuarioContext, cambiarContrasenia } = useUser();
  const [showCambiarContrasenia, setShowCambiarContrasenia] = useState(false);

  useEffect(() => {
    if (cambiarContrasenia) {
      setShowCambiarContrasenia(true);
    }
  }, [cambiarContrasenia]);

  const handleCerrarModal = () => {
    setShowCambiarContrasenia(false);
  };

  return (
    <div>
      {showCambiarContrasenia ? (
        <CambiarContraseniaEmpleado show={showCambiarContrasenia} handleClose={handleCerrarModal} />
      ) : (
        <div>
            {/* Barra de navegación específica para el cocinero */}
            <NavBar />
            {/* Panel de administración con título "Cocinero" */}
            <PanelAdmin title={"Cocinero"} />
            {/* Contenido de la página del cocinero */}
            <CocineroPage />
        </div>
      )}
    </div>
  );
};

export default Cocinero;
