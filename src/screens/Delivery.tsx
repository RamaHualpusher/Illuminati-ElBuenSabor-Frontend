import React from "react";
import NavBar from "../components/NavBar/AdminBar";
import DeliveryPage from "../components/DeliveryPage/DeliveryPage";
import PanelAdmin from "../components/AdminPage/PanelAdmin";

const Delivery = () => {
    return (
        <div>
            {/* Barra de navegación específica para el servicio de delivery */}
            <NavBar />
            {/* Panel de administración con título "Delivery" */}
            <PanelAdmin title={"Delivery"} />
            {/* Contenido de la página de gestión de delivery */}
            <DeliveryPage />
        </div>
    );
};

export default Delivery;
