import React from "react";
import NavBar from "../components/NavBar/AdminBar";
import PanelAdmin from "../components/AdminPage/PanelAdmin";
import CajeroPage from "../components/CajeroPage/CajeroPage";

const Cajero = () => {
    return (
        <div>
            {/* Barra de navegación específica para el cajero */}
            <NavBar />
            {/* Panel de administración con título "Cajero" */}
            <PanelAdmin title={"Cajero"} />
            {/* Contenido de la página del cajero */}
            <CajeroPage />
        </div>
    );
};

export default Cajero;
