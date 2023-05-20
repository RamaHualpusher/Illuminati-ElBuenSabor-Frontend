import React from "react";
import NavBar from "../components/NavBar/AdminBar";
import CocineroPage from "../components/CocineroPage/CocineroPage";
import PanelAdmin from "../components/AdminPage/PanelAdmin";

const Cocinero = () => {
    return (
        <div>
            <NavBar/>          
            <PanelAdmin title={"Cocinero"}/>  
            <CocineroPage/>
        </div>
    );
};

export default Cocinero;