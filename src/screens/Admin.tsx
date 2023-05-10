import React from "react";
import AdminPage from "../components/AdminPage/AdminPage";
import PanelAdmin from "../components/AdminPage/PanelAdmin";
import NavBar from "../components/NavBar/AdminBar";

const Admin = () => {
    return (
        <div>
            <NavBar/>            
            <PanelAdmin title={"Admin"}/>
            <AdminPage />
        </div>
    );
};

export default Admin;