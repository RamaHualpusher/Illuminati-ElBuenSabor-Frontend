import React, { useEffect, useState } from "react";
import { useUser } from "../context/User/UserContext";
import NavBar from "../components/NavBar/AdminBar";
import DeliveryPage from "../components/DeliveryPage/DeliveryPage";
import PanelAdmin from "../components/AdminPage/PanelAdmin";
import CambiarContraseniaEmpleado from "../components/OpcionesCliente/MiPerfil/CambiarContraseniaEmpleado";

const Delivery = () => {
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
          {/* Barra de navegación específica para el servicio de delivery */}
          <NavBar />
          {/* Panel de administración con título "Delivery" */}
          <PanelAdmin title={"Delivery"} />
          {/* Contenido de la página de gestión de delivery */}
          <DeliveryPage />
        </div>
      )}
    </div>
  );
};

export default Delivery;
