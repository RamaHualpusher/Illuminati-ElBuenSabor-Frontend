import React from "react";
import AdminPage from "../components/AdminPage/AdminPage";
import NavbarAdmin from "../components/AdminPage/NavbarAdmin";
import NavBar from "../components/NavBar/Navbar";

const Admin = () => {
    return (
        <div>
            <NavBar/>
            <NavbarAdmin title={"Admin"}/>
            <AdminPage />
        </div>
    );
};

export default Admin;