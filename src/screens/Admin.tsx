import React from "react";
import AdminPage from "../components/AdminPage/AdminPage";
import NavBar from "../components/NavBar/AdminBar";

const Admin = () => {
  return ( 
    <div className="d-flex" style={{
      width: "100%",
      height: "100vh",
  }}>
      <NavBar />
      <div className="flex-grow-1">
        <AdminPage />
      </div>
    </div>
  );
};

export default Admin;
