import React from "react";
import NavBar from "../components/NavBar/AdminBar";
import CocineroPage from "../components/CocineroPage/CocineroPage";
import PanelAdmin from "../components/AdminPage/PanelAdmin";

const Cocinero = () => {
    return (
        <div>
            {/* Barra de navegación específica para el cocinero */}
            <NavBar />
            {/* Panel de administración con título "Cocinero" */}
            <PanelAdmin title={"Cocinero"} />
            {/* Contenido de la página del cocinero */}
            <CocineroPage />
        </div>
    );
};

export default Cocinero;
