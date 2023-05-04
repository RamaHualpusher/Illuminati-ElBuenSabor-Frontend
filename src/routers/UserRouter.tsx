import React from "react";
import NavBar from "../components/Componentes/Navbar";
import Landing from "../components/Landing/Landing";
import { Route, Routes } from "react-router-dom";
import { Link } from "react-router-dom";

const UserRouter = () => {
  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Landing />} />
      </Routes>
      <Link to="/cocina/ingredientes" className="btn btn-success m-2">Ingredientes</Link>
      <Link to="/cocina/productos" className="btn btn-success m-2">Productos</Link>
    </div>
  );
};

export default UserRouter;