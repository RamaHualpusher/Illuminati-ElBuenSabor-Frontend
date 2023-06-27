import React from "react";
import AdminPage from "../components/AdminPage/AdminPage";
import NavBar from "../components/NavBar/AdminBar";
import PanelAdmin from "../components/AdminPage/PanelAdmin";

const Admin = () => {
  return (
    <div className="d-flex">
      <NavBar />
      <div className="flex-grow-1">
        <PanelAdmin title={"Administrador"} />
        <AdminPage />
      </div>
    </div>
  );
};

export default Admin;
