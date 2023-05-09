import React from "react";
import AdminPage from "../components/AdminPage/AdminPage";
import AdminBar from "../components/AdminPage/NavbarEmpleado";
import Navbar from "../components/NavBar/Navbar";

const Admin = () => {
    return (
        <div>
            <Navbar />
            <AdminBar />

            <AdminPage />
        </div>
    );
};

export default Admin;