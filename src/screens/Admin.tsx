import React from "react";
import AdminPage from "../components/AdminPage/AdminPage";
import AdminBar from "../components/AdminPage/NavbarEmpleado";
import NavBar from "../components/NavBar/Navbar";

const Admin = () => {
    return (
        <div>
            <NavBar/>
            <AdminBar />

            <AdminPage />
        </div>
    );
};

export default Admin;