import React from "react";
import NavBar from "../components/Componentes/Navbar";
import Landing from "../components/Landing/Landing";
import { Route, Routes } from "react-router-dom";

const UserRouter = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
    </div>
  );
};

export default UserRouter;