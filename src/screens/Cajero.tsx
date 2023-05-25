import React from "react";
import NavBar from "../components/NavBar/AdminBar";
import PanelAdmin from "../components/AdminPage/PanelAdmin";
import CajeroPage from "../components/CajeroPage/CajeroPage";

const Cajero = () => {
    return (
        <div>
            <NavBar/>            
            <PanelAdmin title={"Cajero"}/>
            <CajeroPage/>
        </div>
    );
};

export default Cajero;