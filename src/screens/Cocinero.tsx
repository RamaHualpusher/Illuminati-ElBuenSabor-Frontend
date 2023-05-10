import React from "react";
import CocineroPage from "../components/CocineroPage/Cocineropage";
import NavBar from "../components/NavBar/AdminBar";

const Cocinero = () => {
    return (
        <div>
            <NavBar/>            
            <CocineroPage />
        </div>
    );
};

export default Cocinero;