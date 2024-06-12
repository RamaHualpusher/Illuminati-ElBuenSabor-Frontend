import React, { useEffect, useState } from "react";
import { useUser } from "../context/User/UserContext";
import NavBar from "../components/NavBar/AdminBar";
import CajeroPage from "../components/CajeroPage/CajeroPage";
import PanelAdmin from "../components/AdminPage/PanelAdmin";
import CambiarContraseniaEmpleado from "../components/OpcionesCliente/MiPerfil/CambiarContraseniaEmpleado";

const Cajero = () => {
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
          {/* Barra de navegación específica para el cajero */}
          <NavBar />
          {/* Panel de administración con título "Cajero" */}
          <PanelAdmin title={"Cajero"} />
          {/* Contenido de la página del cajero */}
          <CajeroPage />
        </div>
      )}
    </div>
  );
};

export default Cajero;
